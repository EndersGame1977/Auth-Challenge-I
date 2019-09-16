const server = require("./server.js");

const PORT = process.env.PORT || 5002;

server.listen(PORT, () => {
  console.log(`\n** Running on port ${port} **\n`);
});
