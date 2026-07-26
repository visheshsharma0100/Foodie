import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDb, { isDatabaseReady } from "./Models/db.js";
import authRouter from "./Routes/Auth.js";
import foodRouter from "./Routes/Food.js";
import orderRouter from "./Routes/Order.js";
dotenv.config();
const app=express();
const allowedOrigins = [
    process.env.FRONTEND_ORIGIN,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:5175",
    "http://127.0.0.1:5175",
    "http://localhost:5176",
    "http://127.0.0.1:5176",
    "http://localhost:5177",
    "http://127.0.0.1:5177",
].filter(Boolean);

const isAllowedOrigin = (origin) => {
    if (!origin) return true;
    if (allowedOrigins.includes(origin)) return true;
    return /^http:\/\/(localhost|127\.0\.0\.1):517\d+$/.test(origin);
};

app.use(cors({
    origin: (origin, callback) => {
        if (isAllowedOrigin(origin)) {
            callback(null, true);
            return;
        }
        callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));
app.use(express.json());

app.get("/api/health", (req, res) => res.status(isDatabaseReady() ? 200 : 503).json({ status: isDatabaseReady() ? "ok" : "database unavailable" }));
const requireDatabase = async (req, res, next) => {
    if (isDatabaseReady()) return next();

    try {
        await connectDb();
        if (isDatabaseReady()) return next();
    } catch (error) {
        console.error("[auth-middleware] database connection failed", error);
    }

    return res.status(503).json({ message: "Database is temporarily unavailable. Please try again shortly." });
};

const generatedFoodImages = new Map();
const pendingFoodImages = new Map();

const createFoodImage = async (title) => {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error("OPENAI_API_KEY is not configured on the server.");
    }

    const prompt = `Professional restaurant food photography of exactly one dish: ${title}. Make the dish authentic, recognisable and visually accurate for its name. Natural warm window light, elegant dark stone table, premium plating, appetising real food texture, three-quarter overhead composition, no people, no hands, no text, no logos, no illustration, no AI-art aesthetic.`;
    const response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "gpt-image-1",
            prompt,
            size: "1024x1024",
            quality: "high",
            output_format: "jpeg",
        }),
    });

    const payload = await response.json();
    if (!response.ok || !payload.data?.[0]?.b64_json) {
        throw new Error(payload.error?.message || "The food image could not be generated.");
    }

    return `data:image/jpeg;base64,${payload.data[0].b64_json}`;
};

app.get("/api/food-image", async (req, res) => {
    const title = String(req.query.title || "").trim();
    if (!title || title.length > 80) {
        return res.status(400).json({ message: "A valid food title is required." });
    }

    const cacheKey = title.toLowerCase();
    if (generatedFoodImages.has(cacheKey)) {
        return res.json({ imageUrl: generatedFoodImages.get(cacheKey) });
    }

    try {
        const pending = pendingFoodImages.get(cacheKey) || createFoodImage(title);
        pendingFoodImages.set(cacheKey, pending);
        const imageUrl = await pending;
        generatedFoodImages.set(cacheKey, imageUrl);
        return res.json({ imageUrl });
    } catch (error) {
        return res.status(502).json({ message: error.message });
    } finally {
        pendingFoodImages.delete(cacheKey);
    }
});

// register/login api
app.use("/api/auth", requireDatabase, authRouter);


//  food 
app.use("/api/food", requireDatabase, foodRouter);


// Order
app.use("/api/order", requireDatabase, orderRouter);

app.use((req, res) => res.status(404).json({ message: "Route not found." }));
app.use((error, req, res, next) => {
    console.error("Unhandled error:", error);
    res.status(500).json({ message: error?.message || "An unexpected server error occurred." });
});

const port = Number(process.env.PORT) || 3000;
if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not configured.");
    process.exit(1);
}
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

const connectWithRetry = () => connectDb().catch(() => {
    console.error("MongoDB is unavailable. Retrying in 5 seconds.");
    setTimeout(connectWithRetry, 5000);
});
connectWithRetry();
