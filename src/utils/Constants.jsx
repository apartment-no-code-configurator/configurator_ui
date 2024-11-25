import { logoutSession } from "./Utils";
import { IoIosLogOut } from "react-icons/io";
export const API_HOST = process.env.nonLocal === "false" ? "localhost" : "www.apartix.in";
export const GEN_ERR_MESSAGE = "Something went wrong. Please try again";
export const MENU_ITEMS = [
  {label: "Chatbots", link: "/chatbots"},
  {label: "Workflows", link: "/workflows"},
  {label: "User Management", link: "/user_management"},
  {label: "Society Details", link: "/society_details"}
];
export const sessionId = localStorage.getItem('apartix_session_id');
export const NAV_ITEMS = sessionId ? [
  {label: "Logout", content: <IoIosLogOut color='#fff' size={"24px"} />, action: logoutSession }
] : [
  {label: "Home", link: "/" },
  {label: "Login", link: "/login" },
  {label: "Register", link: "/register"}
];
export const DATA_TYPES = [
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

export const OPTIONS_TABLE_HEADERS = ["Label", "Value", "Description", "Actions"];