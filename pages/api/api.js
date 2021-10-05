import { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
import { phraseResolver } from "../../util/api";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await NextCors(req, res, {
    methods: ["GET", "POST"],
    origin: "*",
    optionsSuccessStatus: 200,
  });
