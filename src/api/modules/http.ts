import http from "@/utils/http"
import type { BasicResponse } from "@/types"

export const requestIndex = () => http.get<BasicResponse>("/api/")
