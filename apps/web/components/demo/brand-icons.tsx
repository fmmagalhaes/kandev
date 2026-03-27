/* eslint-disable @next/next/no-img-element */
type IconProps = { className?: string };

export function JiraIcon({ className }: IconProps) {
  return <img src="/demo-icons/jira.svg" alt="Jira" className={className} />;
}

export function SlackIcon({ className }: IconProps) {
  return <img src="/demo-icons/slack.svg" alt="Slack" className={className} />;
}

export function OutlookIcon({ className }: IconProps) {
  return <img src="/demo-icons/outlook.svg" alt="Outlook" className={className} />;
}
