const GOOD = {
  icon: ":white_check_mark:",
};
const WARNING = {
  icon: ":warning:",
};

const getMarkerText = (env) => {
  return `<!-- github-terraform-plan-comment-action for ${env} -->`;
};

const createComment = (plan, env, planUrl) => {
  let props = GOOD;
  if (plan.summary.destroy > 0) {
    props = WARNING;
  }

  let ret = `${getMarkerText(env)}
## :construction: Succeeded Terraform Plan${env ? ` for **\`${env}\`**` : ""}
  
${props.icon} **${plan.summary.str}**

[Click here](${planUrl}) to see full logs.

`;

  if (plan.action.sections.create.length > 0) {
    const names = plan.action.sections.create.map((a) => `* \`${a.name}\``).join("\n");
    ret += `### Create\n${names}\n`;
  }

  if (plan.action.sections.update.length > 0) {
    const names = plan.action.sections.update.map((a) => `* \`${a.name}\``).join("\n");
    ret += `### Update\n${names}\n`;
  }

  if (plan.action.sections.replace.length > 0) {
    const names = plan.action.sections.replace.map((a) => `* \`${a.name}\``).join("\n");
    ret += `### Replace\n${names}\n`;
  }

  if (plan.action.sections.destroy.length > 0) {
    const names = plan.action.sections.destroy.map((a) => `* \`${a.name}\``).join("\n");
    ret += `### Destroy\n${names}\n`;
  }

  return ret;
};

module.exports = {
  createComment,
  getMarkerText,
};
