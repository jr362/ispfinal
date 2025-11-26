import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";


const uri = process.env.MONGO_URI!;
const client = new MongoClient(uri);


export async function GET(_: Request, { params }: { params: { seriesId: string } }) {
	const { seriesId } = params;
	await client.connect();


	const db = client.db("fred");
	const collection = db.collection("series");


	const doc = await collection.findOne({ seriesId });
	if (!doc) {
		return NextResponse.json([], { status: 404 });
	}


	return NextResponse.json(doc.data);
}
