import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Call Firestore REST API directly from the server to bypass client-side CORS or API key Referrer restrictions
    const res = await fetch(
      "https://firestore.googleapis.com/v1/projects/lwtwaitinglakshyniti/databases/(default)/documents/waitlist?key=AIzaSyBMheEPPdp3gZ-Qfr1fgnGbLph9omfpN64",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            email: { stringValue: email },
            createdAt: { timestampValue: new Date().toISOString() },
          },
        }),
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Firestore Error:", errorData);
      return NextResponse.json(
        { error: "Failed to save to Firestore", details: errorData },
        { status: res.status }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Waitlist API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
