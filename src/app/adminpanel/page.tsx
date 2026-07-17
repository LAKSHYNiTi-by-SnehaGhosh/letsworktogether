import { redirect } from "next/navigation";

export default function AdminPanelIndex() {
  redirect("/adminpanel/database/data");
}
