import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";


const uri = process.env.MONGO_URI!;
const client = new MongoClient(uri);


export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const seriesId = searchParams.get("series");


	if (!seriesId) {
		return NextResponse.json({ error: "Missing series parameter" }, { status: 400 });
	}


	await client.connect();
	const db = client.db("fred");
	const collection = db.collection("series");


	const existing = await collection.findOne({ seriesId });
		if (existing) {
		return NextResponse.json(existing.data);
	}


	const fredKey = process.env.FRED_API_KEY;
	const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${fredKey}&file_type=json`;


	const fredRes = await fetch(url);
	const json = await fredRes.json();


	const parsed = json.observations.map((d: any) => ({
		date: d.date,
		value: parseFloat(d.value),
	})).filter((d: any) => !isNaN(d.value));


	await collection.updateOne(
		{ seriesId },
		{ $set: { seriesId, data: parsed, updatedAt: new Date() } },
		{ upsert: true }
	);


	return NextResponse.json(parsed);
}
