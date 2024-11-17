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
export const dataTypes = [
  {key: "text", value: "text", text: "Text"},
  {key: "textarea", value: "textarea", text: "Textarea"},
  {key: "date_time", value: "date_time", text: "DateTime"},
  {key: "select", value: "select", text: "Select"},
  {key: "select_boxes", value: "select_boxes", text: "Select boxes"},
  {key: "radio", value: "radio", text: "Radio"},
  {key: "checkboxes", value: "checkboxes", text: "Checkboxes"},
  {key: "number", value: "number", text: "Number"},
  {key: "email", value: "email", text: "Email"}
];