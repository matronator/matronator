import fs from 'fs/promises';
import fetch from 'node-fetch';

const API_URL = "https://api.github.com";

try {
    const username = process.env.GH_USER ?? "matronator";
    const url = `${API_URL}/users/${username}/repos?per_page=20&sort=stars`;
    const response = await fetch(url);
    const repos = await response.json();
    const repoOfTheWeek = repos[Math.floor(Math.random() * (repos.length - 1))];

    let updates = `<!-- start repo of the week -->\n\n`;
    const { name, full_name, description } = repoOfTheWeek;
    const template = `<h2 align="center">
  Repo of the week:
</h2>
<h3 align="center"><a href="https://github.com/${full_name}">${name}</a></h3>
<p align="center">
  <a href="https://github.com/${full_name}">
    <img align="center" src="https://github-readme-stats.vercel.app/api/pin/?username=${username}&repo=${name}&title_color=bf1f1f&icon_color=ffbf00&text_color=ffffff&bg_color=100,000000,360428,730517" alt="${full_name}">
  </a>
</p>
<p align="center">${description}</p>\n\n`;

    updates = updates.concat(template);
    updates = updates.concat('<!-- end repo of the week -->');

    // Rewrite README with new post content
    const currentText = await fs.readFile('README.md', 'utf8');
    const repoSection = /<!-- start repo of the week -->[\s\S]*<!-- end repo of the week -->/g;
    const newText = currentText.replace(repoSection, updates);

    await fs.writeFile('README.md', newText);
} catch (error) {
  console.error('there was an error:', error.message);
}
