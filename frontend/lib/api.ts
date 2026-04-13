// API client for Resume Builder backend
// Set NEXT_PUBLIC_API_BASE in .env.local to override the default
export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? "http://127.0.0.1:8000"

// FastAPI 422 detail is an array of Pydantic error objects; flatten to a string
function normalizeDetail(detail: unknown): string {
  if (typeof detail === "string") return detail
  if (Array.isArray(detail)) {
    return detail
      .map((e) =>
        typeof e === "object" && e !== null && "msg" in e
          ? String((e as { msg: unknown }).msg)
          : String(e)
      )
      .join("; ")
  }
  return String(detail)
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

export interface ResumeOut {
  ok: boolean
  cleaned_name: string
  cleaned_email: string
  cleaned_phone: string
  cleaned_location?: unknown
  cleaned_urls?: string[]
  cleaned_experience?: unknown[]
  cleaned_skills?: string[]
  cleaned_education?: unknown[]
  cleaned_certifications?: unknown[]
  warnings: string[]
  ai_resume_markdown?: string
  ai_model?: string
}

// Validate resume JSON against the backend
export async function validateResume(
  resumeJson: object,
  apiKey: string
): Promise<ApiResponse<ResumeOut>> {
  try {
    const response = await fetch(`${API_BASE}/api/v1/resume/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify(resumeJson),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: normalizeDetail(data.detail) || data.message || `HTTP ${response.status}`,
        data,
      }
    }

    return { success: true, data }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Network error",
    }
  }
}

// Generate resume using the backend AI
export async function generateResume(
  resumeJson: object,
  apiKey: string
): Promise<ApiResponse<ResumeOut>> {
  try {
    const response = await fetch(`${API_BASE}/api/v1/resume/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify(resumeJson),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: normalizeDetail(data.detail) || data.message || `HTTP ${response.status}`,
        data,
      }
    }

    return { success: true, data }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Network error",
    }
  }
}

// List saved resumes (optional endpoint)
export async function listResumes(
  apiKey: string
): Promise<ApiResponse<unknown[]>> {
  try {
    const response = await fetch(`${API_BASE}/api/v1/resume/`, {
      method: "GET",
      headers: {
        "X-API-Key": apiKey,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: normalizeDetail(data.detail) || data.message || `HTTP ${response.status}`,
        data,
      }
    }

    return { success: true, data }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Network error",
    }
  }
}
