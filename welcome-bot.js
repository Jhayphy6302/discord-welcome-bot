const {
  Client,
  GatewayIntentBits,
  Partials,
  AttachmentBuilder,
  EmbedBuilder,
} = require("discord.js");
const Canvas = require("canvas");

// 🆕 Register your custom font
Canvas.registerFont("./Audiowide-Regular.ttf", {family: "Audiowide"});
require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

// ✅ Proper "ready" event
client.once("clientReady", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on("guildMemberAdd", async (member) => {
  const channelId = "1432454460147237025"; // 👈 your welcome channel ID
  const channel = member.guild.channels.cache.get(channelId);
  if (!channel) return console.log("⚠️ Welcome channel not found!");

  try {
    // 🖼️ Create Canvas
    const canvas = Canvas.createCanvas(800, 300);
    const ctx = canvas.getContext("2d");

    // 🖤 Background
    const background = await Canvas.loadImage("Banner.png");
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    // 👤 Avatar
    const avatar = await Canvas.loadImage(
      member.user.displayAvatarURL({ extension: "png", size: 256 })
    );
    ctx.save();
    ctx.beginPath();
    ctx.arc(150, 150, 75, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 75, 75, 150, 150);
    ctx.restore();

    // ✍️ Text
ctx.font = "bold 45px Audiowide";
ctx.fillStyle = "#ffffff";
ctx.fillText("WELCOME", 270, 150);

// ✍️ Dynamic Username Text
ctx.fillStyle = "#00FFFF";
let username = member.user.username;

// Adjust font size based on name length
let fontSize = 55;
if (username.length > 12) fontSize = 45;
if (username.length > 18) fontSize = 35;

// Apply font
ctx.font = `bold ${fontSize}px Audiowide`;

// Optional: center horizontally (adjust width if needed)
const textWidth = ctx.measureText(username).width;
const startX = 270 + (400 - textWidth) / 2; // 400 = width space area for text
ctx.fillText(username, startX, 230);

    // 📎 Image attachment
    const attachment = new AttachmentBuilder(canvas.toBuffer("image/png"), {
      name: "welcome.png",
    });

    // 🧠 Fetch webhook
let webhook = (await channel.fetchWebhooks()).find(
  (wh) => wh.name === "Jhay Welcome Bot"
);

// 🧩 Check if webhook is missing or stale
const isStale =
  !webhook ||
  webhook.name !== "Jhay Welcome Bot" ||
  !webhook.avatar ||
  webhook.avatarURL() !== client.user.displayAvatarURL();

if (isStale) {
  if (webhook) {
    console.log("♻️ Deleting stale webhook and recreating...");
    try {
      await webhook.delete();
    } catch (err) {
      console.warn("⚠️ Couldn't delete old webhook:", err.message);
    }
  }

  // ✅ Recreate & reassign webhook variable properly
  webhook = await channel.createWebhook({
    name: "Jhay Welcome Bot",
    avatar: client.user.displayAvatarURL(),
  });

  console.log("✅ Created fresh webhook for welcome messages.");
} else {
  console.log("🔁 Reusing existing valid webhook.");
}


    // 🧱 Embed
    const embed = new EmbedBuilder()
      .setDescription(
        `🎉 **Welcome** ${member} 🚀\n\nSalamat sa pag-avail! Check mo na agad ang **guide channel** para ma-setup ang games mo!`
      )
      .setColor("#5865F2")
      .setImage("attachment://welcome.png")
      .setFooter({ text: "Enjoy your stay at Jhay Tech Server!" });

    // ⏳ Slight delay for Discord cache consistency
    await new Promise((res) => setTimeout(res, 1000));

    // 📨 Send message via webhook
    await webhook.send({
      content: `👋 **Welcome to the server, ${member}!** 🎉`,
      embeds: [embed],
      files: [attachment],
      username: "Jhay Welcome Bot",
      avatarURL: client.user.displayAvatarURL(),
      allowedMentions: { users: [member.id] },
    });

    console.log(`✅ Sent welcome message for ${member.user.tag}`);
  } catch (error) {
    console.error("❌ Error sending welcome message:", error);
  }
});

// 👋 Member Leave Message
client.on("guildMemberRemove", async (member) => {
  const channelId = "1432454460147237025"; // 👈 same welcome channel ID
  const channel = member.guild.channels.cache.get(channelId);
  if (!channel) return console.log("⚠️ Goodbye channel not found!");

  try {
    // 🖼️ Create Canvas
    const canvas = Canvas.createCanvas(800, 300);
    const ctx = canvas.getContext("2d");

    // 🖤 Background
    const background = await Canvas.loadImage("Banner.png");
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    // 👤 Avatar
    const avatar = await Canvas.loadImage(
      member.user.displayAvatarURL({ extension: "png", size: 256 })
    );
    ctx.save();
    ctx.beginPath();
    ctx.arc(150, 150, 75, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 75, 75, 150, 150);
    ctx.restore();

    // ✍️ Text
ctx.font = "bold 45px Audiowide";
ctx.fillStyle = "#ffffff";
ctx.fillText("GOODBYE", 270, 150);

// ✍️ Dynamic Username Text
ctx.fillStyle = "#931212ff";
let username = member.user.username;

// Adjust font size based on name length
let fontSize = 55;
if (username.length > 12) fontSize = 45;
if (username.length > 18) fontSize = 35;

// Apply font
ctx.font = `bold ${fontSize}px Audiowide`;

// Optional: center horizontally (adjust width if needed)
const textWidth = ctx.measureText(username).width;
const startX = 270 + (400 - textWidth) / 2; // 400 = width space area for text
ctx.fillText(username, startX, 230);

    // 📎 Image attachment
    const attachment = new AttachmentBuilder(canvas.toBuffer("image/png"), {
      name: "goodbye.png",
    });

    // 🧠 Fetch or create webhook (same logic as welcome)
    let webhook = (await channel.fetchWebhooks()).find(
      (wh) => wh.name === "Jhay Welcome Bot"
    );

    const isStale =
      !webhook ||
      webhook.name !== "Jhay Welcome Bot" ||
      !webhook.avatar ||
      webhook.avatarURL() !== client.user.displayAvatarURL();

    if (isStale) {
      if (webhook) {
        console.log("♻️ Deleting stale webhook and recreating (goodbye)...");
        try {
          await webhook.delete();
        } catch (err) {
          console.warn("⚠️ Couldn't delete old webhook:", err.message);
        }
      }

      webhook = await channel.createWebhook({
        name: "Jhay Welcome Bot",
        avatar: client.user.displayAvatarURL(),
      });

      console.log("✅ Created fresh webhook for goodbye messages.");
    } else {
      console.log("🔁 Reusing existing valid webhook for goodbye message.");
    }

    // 🧱 Embed
    const embed = new EmbedBuilder()
      .setDescription(
        `😢 **${member.user.username}** has left the server.\n\nWe hope to see you again soon! 💫`
      )
      .setColor("#FF4040")
      .setImage("attachment://goodbye.png")
      .setFooter({ text: "Goodbye from Jhay Tech Server!" });

    // 📨 Send message via webhook
    await webhook.send({
      content: `👋 **Goodbye ${member.user.username}!**`,
      embeds: [embed],
      files: [attachment],
      username: "Jhay Welcome Bot",
      avatarURL: client.user.displayAvatarURL(),
    });

    console.log(`✅ Sent goodbye message for ${member.user.tag}`);
  } catch (error) {
    console.error("❌ Error sending goodbye message:", error);
  }
});



// 👋 Optional command
client.on("messageCreate", (message) => {
  if (message.author.bot) return;
  if (message.content === "!hello") {
    message.channel.send(
      `👋 Hello ${message.author.username}! Welcome to the server!`
    );
  }
});

client.login(process.env.TOKEN);
