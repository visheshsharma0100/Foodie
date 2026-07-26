import express from "express";
import Food from '../Models/Food.js';
import AuthMiddleware from '../Middleware/AuthMiddleware.js';
import AdminMiddleware from '../Middleware/AdminMiddleware.js';
const router = express.Router();
const foodFields = ["name", "price", "category", "description", "image", "isVeg", "isAvailable"];
const starterMenu = [
    { name: "Margherita Pizza", price: 299, category: "Pizza", description: "Mozzarella, basil and tomato sauce on a crisp base.", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=80", isVeg: true, isAvailable: true },
    { name: "Classic Cheese Burger", price: 249, category: "Burger", description: "Grilled patty, cheddar, fresh lettuce and signature sauce.", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80", isVeg: false, isAvailable: true },
    { name: "Creamy Red Pasta", price: 229, category: "Pasta", description: "Penne tossed in slow-cooked tomato and herb sauce.", image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=900&q=80", isVeg: true, isAvailable: true },
    { name: "Veg Biryani", price: 279, category: "Biryani", description: "Aromatic basmati rice with vegetables and house spices.", image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=900&q=80", isVeg: true, isAvailable: true },
    { name: "Butter Chicken", price: 349, category: "North Indian", description: "Tender chicken in a rich, buttery tomato gravy.", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=80", isVeg: false, isAvailable: true },
    { name: "Chocolate Lava Cake", price: 179, category: "Dessert", description: "Warm chocolate cake with a gooey molten centre.", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80", isVeg: true, isAvailable: true },
];

function validateFood(payload, partial = false) {
    const food = Object.fromEntries(Object.entries(payload).filter(([key]) => foodFields.includes(key)));
    if (!partial && ["name", "price", "category", "description", "image", "isVeg"].some((key) => food[key] === undefined || food[key] === "")) return { error: "All food fields are required." };
    if (food.price !== undefined && (!Number.isFinite(Number(food.price)) || Number(food.price) <= 0)) return { error: "Price must be a positive number." };
    if (food.image !== undefined && !/^https?:\/\//i.test(food.image)) return { error: "Image must be a valid HTTP(S) URL." };
    if (food.price !== undefined) food.price = Number(food.price);
    return { food };
}

// Add food 
router.post("/add",AuthMiddleware,AdminMiddleware,async (req,res)=>{
    try{
    const { food, error } = validateFood(req.body);
    if (error) return res.status(400).json({ message: error });
    const newFood=await new Food(food)
    await newFood.save();
    res.status(200).json({
        message:"Food added successfully"
    });
}
    catch(error){
        return res.status(500).json({
            message: error.message
        });
    }
});

// Seed a useful starter catalogue once, from an authenticated admin account.
router.post("/seed", AuthMiddleware, AdminMiddleware, async (req, res) => {
    try {
        if (await Food.exists({})) return res.status(409).json({ message: "Menu already contains food items." });
        const items = await Food.insertMany(starterMenu);
        return res.status(201).json({ message: "Starter menu added successfully.", item: items });
    } catch (error) {
        return res.status(500).json({ message: "Unable to seed the starter menu." });
    }
});


// Get food from collection
router.get("/",async (req,res)=>{
    try{
        const item = await Food.find().sort({ createdAt: -1 });
        return res.status(200).json({
            message: item.length ? "Available Food" : "No Food Available",
            item,
        });
    }
    catch(error){
        return res.status(500).json({
            message:error.message
        });
    }
});


// Get food by id
router.get("/:id",async(req,res)=>{
    try{
    let id=req.params.id;
  let onefood= await Food.findById(id);
    if(!onefood){
        return res.status(404).json({
            message:"Invalid id"
        });
    }
    return res.status(200).json({
        message:"Your food",
        onefood
    });

    }
    catch(error){
        return res.status(500).json({
            message:error.message
        });
    }
});

// Update food
router.put("/:id",AuthMiddleware,AdminMiddleware,async (req,res)=>{
    try{
    let id=req.params.id;
   const { food, error } = validateFood(req.body, true);
   if (error || Object.keys(food).length === 0) return res.status(400).json({ message: error || "No valid food fields supplied." });
   let hasFood= await Food.findByIdAndUpdate(id,food,
    {new:true}
   );
   if(!hasFood){
    return res.status(404).json({
        message:"No food available"
    });
   }
   return res.status(200).json({
    message:"Updated Food",
    hasFood
   });

}
    catch(error){
        return res.status(500).json({
            message:error.message
        });
    }
});

// Delete Food
router.delete("/:id",AuthMiddleware,AdminMiddleware,async(req,res)=>{
    try{
    const id=req.params.id;
    const deleteFood=await Food.findByIdAndDelete(id);
    if(!deleteFood){
        return res.status(404).json({
            message:"Food not found",
        });
    }
    return res.status(200).json({
        message:"Food Deleted",
        deleteFood
    });
}
    catch(error){
        return res.status(500).json({
            message:error.message
        });
    }
});

export default router;
