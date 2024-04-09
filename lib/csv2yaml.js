import yaml from "js-yaml";
import csv from "csvtojson";
import groupBy from "json-groupby";
import fs from "node:fs/promises";
import path from "node:path";
import { link } from "node:fs";

export const csv2yaml = async (csvPath, writeDir) => {
  const jsonArray = await csv().fromFile(csvPath);
  const groupedJSON = convert(jsonArray);
  const writePromises = groupedJSON.map(async (topic) => {
    const dirName = topic.title
      .split(" ")
      .map((w) => w.toLowerCase())
      .join("-");

    await fs.mkdir(path.resolve(writeDir, dirName), { recursive: true });

    return fs.writeFile(
      path.resolve(writeDir, dirName, `index.mdoc`),
      yaml.dump(topic)
    );
  });

  try {
    await writePromises;
  } catch (err) {
    console.err(err);
    process.exit(1);
  }
};

// convert json with type {Root Level: string, Level 1: string, Classes: string, Link: string}[] to json with type
// {title: string, content: {value: {label: string link: {url: string, text: string}}[]}[]}[] where title is the Root Level
// and content is an array of objects with value as an object with label as Level 1 and link as an object with url as Link
// and text as the same as url
const convert = (jsonArray) => {
  const groupedJSON = groupBy(
    jsonArray,
    ["Root Level", "Level 1"],
    ["Classes", "Link"]
  );

  return Object.entries(groupedJSON).map(([title, content]) => ({
    title,
    content: {
      value: {
        topics: Object.entries(content).map(([topic, topicContent]) => ({
          label: topic,
          children: topicContent.Classes.map((c, index) => {
            return {
              label: c,
              link: {
                url: topicContent.Link[index],
                text: topicContent.Link[index],
              },
            };
          }),
        })),
      },
    },
  }));
};
