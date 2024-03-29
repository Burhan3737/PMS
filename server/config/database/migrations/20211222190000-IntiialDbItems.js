module.exports = {
  async up() {
    console.log("Intial");
    await createDatabase();
  },
};
