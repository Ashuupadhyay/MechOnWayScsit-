const mongoose = require("mongoose");

const adSchema = new mongoose.Schema(
  {
    // Uploaded image ka poora URL (3:4 ratio, 600x800 best)
    image: { type: String, required: true },

    // Image file ka naam (server par se delete karne ke liye)
    imageFile: { type: String, default: "" },

    // Click par khulne wala link (optional)
    link: { type: String, default: "", trim: true },

    // Ad ka naam / alt text (optional)
    title: { type: String, default: "", trim: true },

    // Ad kahan dikhana hai. Abhi sirf directory ki left patti.
    placement: {
      type: String,
      enum: ["directory-left"],
      default: "directory-left",
      index: true,
    },

    // false = hide (delete kiye bina band kar sakte ho)
    isActive: { type: Boolean, default: true, index: true },

    // Chhota number pehle dikhega
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ad", adSchema);