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

  if (plan.summary.add > 0) {
    const added = plan.action.sections.create.concat(plan.action.sections.replace);
    const names = added.map((a) => `* \`${a.name}\``).join("\n");
    ret += `### Add\n${names}\n`;
  }

  if (plan.summary.change > 0) {
    const names = plan.action.sections.update.map((a) => `* \`${a.name}\``).join("\n");
    ret += `### Change\n${names}\n`;
  }

  if (plan.summary.destroy > 0) {
    const destroyed = plan.action.sections.destroy.concat(plan.action.sections.replace);
    const names = destroyed.map((a) => `* \`${a.name}\``).join("\n");
    ret += `### Destroy\n${names}\n`;
  }

  return ret;
};

module.exports = {
  createComment,
  getMarkerText,
};
