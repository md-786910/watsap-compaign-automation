import Batch from "../components/settings/Batch";
import GetSession from "../components/settings/session";
import Subscription from "../components/settings/Subscription";

const tabKey = {
  GENERAL: "general",
  SUBSCRIPTION: "subscription",
  PROFILE: "profile",
};
const tabList = [
  {
    name: "General Settings",
    component: () => <><Batch /><GetSession /></>,
    id: tabKey.GENERAL,
  },
  {
    name: "Subscription",
    component: () => <Subscription />,
    id: tabKey.SUBSCRIPTION,
  },
  {
    name: "Profile",
    component: () => <div>Profile</div>,
    id: tabKey.PROFILE,
  },
];

export { tabKey, tabList };
