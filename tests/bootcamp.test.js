const axios = require("axios");
const dotenv = require("dotenv");

// Load env vars
dotenv.config({ path: "./config/config.env" });

const PORT = process.env.PORT;

test("Gets 200 response", async () => {
  const res = await axios.get(
    `http://localhost:${PORT}/api/v1/bootcamps/5df698f8f38b334326bb677c`
  );
  expect(res.status).toBe(200);
});

test("Gets right bootcamp back", async () => {
  const res = await axios.get(
    `http://localhost:${PORT}/api/v1/bootcamps/5df698f8f38b334326bb677c`
  );
  expect(res.data.data.id).toBe("5df698f8f38b334326bb677c");
});

test("Only gets one object back", async () => {
  const res = await axios.get(
    `http://localhost:${PORT}/api/v1/bootcamps/5df698f8f38b334326bb677c`
  );
  expect(Array.isArray(res.data.data.type)).toBe(false);
});

test("Get 404 with nonexisting ID", async () => {
  try {
    const res = await axios.get(
      `http://localhost:${PORT}/api/v1/bootcamps/5df698f8f38b334326bb622jåojs77c`
    );
  } catch (e) {
    expect(e.response.status).toBe(404);
  }
});

test("Can find bootcamp within radius", async () => {
  const url = `http://localhost:${PORT}/api/v1/bootcamps/radius/02118/10`
  const res = await axios.get(url)
  expect(res.status).toBe(200)
  expect(res.data.data.length).not.toBe(0)
})