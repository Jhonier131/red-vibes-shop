const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const purchasedItemSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: false,
  },
  items: [
    {
      _id: false,
      productId: { type: Schema.Types.ObjectId, ref: "products", required: true },
      size: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  state: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  documentId: Number,
  phone: String,
  department: String,
  city: String,
  address: String,
});

const purchasedItemsSC = model("purchasedItems", purchasedItemSchema);
module.exports = { purchasedItemsSC };
