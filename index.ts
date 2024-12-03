import { LabelerServer } from "@skyware/labeler";
import { Bot, Labeler } from "@skyware/bot";
import { Database } from "bun:sqlite";

const db = new Database("./data/labels.db");

const server = new LabelerServer({
  did: process.env.LABELER_DID,
  signingKey: process.env.LABELER_KEY,
  dbPath: "./data/labels.db",
});

server.start({ host: "0.0.0.0", port: 14831 }, (error, address) => {
  if (error) {
    console.error("Failed to start server", error);
  } else {
    console.log("Server started on", address);
  }
});

const bot = new Bot();

await bot.login({
  identifier: process.env.LABELER_DID,
  password: process.env.LABELER_PWD,
});

bot.on("like", async (like) => {
  if (like.subject instanceof Labeler) {
    console.log("Received like", like.user.did, like.subject.uri);
    const labels = [
      "bulbasaur",
      "charmander",
      "squirtle",
      "pikachu",
      "eevee",
      "chikorita",
      "cyndaquil",
      "totodile",
      "marill",
      "treecko",
      "torchic",
      "mudkip",
      "ralts",
      "turtwig",
      "chimchar",
      "piplup",
      "snivy",
      "tepig",
      "oshawott",
      "chespin",
      "fennekin",
      "froakie",
      "rowlet",
      "litten",
      "popplio",
      "grookey",
      "scorbunny",
      "sobble",
      "sprigatito",
      "fuecoco",
      "quaxly",
      "togepi",
    ];

    const query = db.prepare("SELECT * FROM labels WHERE uri == $uri");
    const result = query.all({ $uri: like.user.did });

    if (result.length > 0) {
      console.log("User", like.user.did, "already has a label");
      return;
    }

    const randomLabel = labels[Math.floor(Math.random() * labels.length)];

    try {
      await like.user.labelAccount([randomLabel]);
      console.log("Labeled account", like.user.did, "with", randomLabel);
      console.log("Account labels", like.user.labels);
    } catch (errors) {
      console.error("Error labeling account", errors);
    }
  }
});
