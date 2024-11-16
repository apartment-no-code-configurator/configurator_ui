export const menuItems = [
  {label: "Chatbots", link: "/chatbots"},
  {label: "Workflows", link: "/workflows"},
  {label: "User Management", link: "/user_management"},
  {label: "Society Details", link: "/society_details"}
];
export const navItems = [
  {label: "Home", link: "/", show: true},
  {label: "Login", link: "/login", show: localStorage.getItem('apartix_session_id') ? false  : true},
  {label: "Register", link: "/register", show: true}
];