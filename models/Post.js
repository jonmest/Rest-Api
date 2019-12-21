const mongoose = require("mongoose");
const slugify = require("slugify");

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title."],
      unique: true,
      trim: true,
      maxlength: [100, "Name can only be 50 characters or less."]
    },
    slug: String,
    content: {
      type: String,
      required: [true, "Please add content."],
    },
    category: {
        type: String,
        default: 'All'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    published: {
      type: Boolean,
      default: false
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create post slug
PostSchema.pre("save", function(next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

// // CASCADE delete coursed when post deleted
// PostSchema.pre('remove', async function (next) {
//   await this.model('Comment').deleteMany({ post: this._id })
//   next()
// })

// // Reverse populate with virtuals
// PostSchema.virtual('comments', {
//   ref: 'Comment',
//   localField: '_id',
//   foreignField: 'post',
//   justOne: false
// })
module.exports = mongoose.model("Post", PostSchema);
