# Vibe Discord Bot

## Подготовка
```bash
npm init -y
npm install discord.js dotenv openai
```

## index.js — Скелет бота
```javascript
import { Client, GatewayIntentBits, Collection } from 'discord.js';
import 'dotenv/config';

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
client.commands = new Collection();

client.once('ready', () => console.log(`Залогинился как ${client.user.tag}`));

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (command) await command.execute(interaction);
});

client.login(process.env.DISCORD_TOKEN);
```

## Слэш-команда (Slash Command)
```javascript
// commands/ask.js
import { SlashCommandBuilder } from 'discord.js';
import OpenAI from 'openai';

const openai = new OpenAI();

export default {
  data: new SlashCommandBuilder()
    .setName('ask')
    .setDescription('Спроси что угодно у ИИ')
    .addStringOption(opt => opt.setName('question').setDescription('Твой вопрос').setRequired(true)),

  async execute(interaction) {
    await interaction.deferReply();
    const question = interaction.options.getString('question');
    const res = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: question }]
    });
    await interaction.editReply(res.choices[0].message.content);
  }
};
```

## Красивая карточка (Rich Embed)
```javascript
import { EmbedBuilder } from 'discord.js';

const embed = new EmbedBuilder()
  .setTitle('Результат поиска')
  .setDescription('Вот что мне удалось найти...')
  .setColor(0x6C5CE7)
  .addFields({ name: 'Категория', value: 'ИИ', inline: true })
  .setFooter({ text: 'Работает на GPT-4' });

await interaction.reply({ embeds: [embed] });
```

## Деплой на Railway
```bash
# Создай Procfile
echo 'worker: node index.js' > Procfile
# Пуш в GitHub → подключи к Railway → добавь переменные окружения
# DISCORD_TOKEN, OPENAI_API_KEY
```

## Необходимые права бота
- Раздел `bot`
- Раздел `applications.commands` (для слэш-команд)
- Права: Send Messages, Embed Links, Use Slash Commands
