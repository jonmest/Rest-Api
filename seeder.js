const fs = require("fs");

const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config/config.env" });


const Post = require('./models/Post')

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});


const posts = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/posts.json`, "utf-8")
)


// IMPORT TO DB
const importData = async () => {
  try {

    await Post.create(posts)

    console.log("Data imported...");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// DELETE
const deleteData = async () => {
  try {

    await Post.deleteMany();
    console.log("Data Destroyed...");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
