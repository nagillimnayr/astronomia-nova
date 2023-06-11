import { writeToJSON } from "./writeToJSON.js";

export async function testWriteToJSON() {
  console.log('hello');
  const args = process.argv[2];
  console.log(args);
  const success: boolean = await writeToJSON([args], 'test.json');

  console.log('test complete: Success? ', success);
}

testWriteToJSON();
