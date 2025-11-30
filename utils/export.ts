
import { PRD } from '../types';

export const downloadFile = (content: string, filename: string, type: string) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const generateMarkdown = (prd: PRD): string => {
  const enabledSections = prd.sections.filter(s => s.isEnabled);
  
  let md = `# ${prd.productName || 'Untitled Product'}\n\n`;
  if (prd.shortDescription) {
    md += `> ${prd.shortDescription}\n\n`;
  }
  
  md += `**Version:** 1.0  \n`;
  md += `**Last Updated:** ${new Date(prd.lastUpdated).toLocaleDateString()}\n\n`;
  md += `---\n\n`;

  enabledSections.forEach(section => {
    md += `## ${section.title}\n\n`;
    md += `${section.content || '(No content)'}\n\n`;
  });

  md += `\n---\n*Generated with Propel PRD*`;

  return md;
};

export const generateText = (prd: PRD): string => {
  const enabledSections = prd.sections.filter(s => s.isEnabled);
  
  let text = `${prd.productName || 'Untitled Product'}\n`;
  text += `${'='.repeat(text.length)}\n\n`;
  
  if (prd.shortDescription) {
    text += `${prd.shortDescription}\n\n`;
  }
  
  text += `Version: 1.0\n`;
  text += `Last Updated: ${new Date(prd.lastUpdated).toLocaleDateString()}\n\n`;

  enabledSections.forEach(section => {
    text += `\n${section.title.toUpperCase()}\n`;
    text += `${'-'.repeat(section.title.length)}\n`;
    text += `${section.content || '(No content)'}\n`;
  });

  return text;
};

export const generateHTML = (prd: PRD): string => {
  const enabledSections = prd.sections.filter(s => s.isEnabled);
  const title = prd.productName || 'Untitled Product';

  let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - PRD</title>
    <style>
        body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 2rem; }
        h1 { font-size: 2.5rem; margin-bottom: 0.5rem; color: #111; }
        .meta { color: #666; font-size: 0.9rem; margin-bottom: 2rem; border-bottom: 1px solid #eee; padding-bottom: 1rem; }
        h2 { margin-top: 2rem; border-bottom: 1px solid #eee; padding-bottom: 0.5rem; color: #111; }
        .description { font-size: 1.2rem; color: #555; margin-bottom: 2rem; font-weight: 300; }
        pre { background: #f4f4f5; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; }
        code { font-family: monospace; background: #f4f4f5; padding: 0.2rem 0.4rem; border-radius: 0.25rem; }
        footer { margin-top: 4rem; text-align: center; color: #888; font-size: 0.8rem; }
    </style>
</head>
<body>
    <header>
        <h1>${title}</h1>
        <div class="description">${prd.shortDescription || ''}</div>
        <div class="meta">
            <span>Version 1.0</span> • 
            <span>Last Updated: ${new Date(prd.lastUpdated).toLocaleDateString()}</span>
        </div>
    </header>
    <main>`;

  enabledSections.forEach(section => {
    // Simple markdown-to-html-ish conversion for paragraphs
    const contentHtml = section.content
        ? section.content.split('\n\n').map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('')
        : '<p><em>(No content)</em></p>';

    html += `
        <section>
            <h2>${section.title}</h2>
            <div>${contentHtml}</div>
        </section>`;
  });

  html += `
    </main>
    <footer>
        Generated with Propel PRD
    </footer>
</body>
</html>`;

  return html;
};
