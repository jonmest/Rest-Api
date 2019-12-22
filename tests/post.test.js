const axios = require("axios");
const dotenv = require("dotenv");

// Load env vars
dotenv.config({ path: "./config/config.env" });

const PORT = process.env.PORT;

test("Gets 200 response", async () => {
  const res = await axios.get(
    `http://localhost:${PORT}/api/v1/posts/`
  );
  expect(res.status).toBe(200);
});

test("Gets right post back", async () => {
  const res = await axios.get(
    `http://localhost:${PORT}/api/v1/posts/overvikt`
  );
  expect(res.status).toBe(200)
  expect(res.data.data.slug).toBe("overvikt");
});

test("Only gets one object back", async () => {
  const res = await axios.get(
    `http://localhost:${PORT}/api/v1/posts/overvikt`
  );
  expect(Array.isArray(res.data.data.type)).toBe(false);
});

test("Get 403 when trying to access unpublished post", async () => {
  try {
    const res = await axios.get(
      `http://localhost:${PORT}/api/v1/posts/persons-are-corporations`
    );
  } catch (e) {
    expect(e.response.status).toBe(403);
  }
});
