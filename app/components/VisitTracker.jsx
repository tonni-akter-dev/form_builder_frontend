"use client";
import { useEffect } from "react";
import axios from "@/lib/axios";

export default function VisitTracker() {
  useEffect(() => {
    // Check if already counted in this session
    if (!sessionStorage.getItem("visitCounted")) {
      axios
        .post("/visits/increment")
        .then(() => sessionStorage.setItem("visitCounted", "true"))
        .catch(console.error);
    }
  }, []);
  return null;
}
