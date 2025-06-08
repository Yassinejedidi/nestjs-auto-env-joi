import * as fs from "fs";
import * as path from "path";
import * as Joi from "joi";

export interface AutoEnvValidationOptions {
  envPath?: string;
}

export function AutoEnvValidation(options: AutoEnvValidationOptions = {}) {
  const envPath = options.envPath || ".env";

  if (!fs.existsSync(envPath)) {
    throw new Error(`Env file not found at path: ${envPath}`);
  }

  const envFile = fs.readFileSync(path.resolve(envPath), "utf-8");
  const lines = envFile.split("\n");

  const schemaMap: Record<string, any> = {};

  let currentTypeTag: string | null = null;
  let currentSubtype: string | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip empty lines or comments that aren't type tags
    if (line === "" || (line.startsWith("#") && !line.startsWith("//"))) {
      continue;
    }

    // If line is a type tag line starting with //
    if (line.startsWith("//")) {
      // Extract type and optional subtypes from this line, e.g. "// enum:admin|user"
      const tagMatch = line.match(/^\/\/\s*(\w+)(?::([^\s]+))?/);

      if (!tagMatch) {
        throw new Error(`Invalid type tag syntax on line ${i + 1}: "${line}"`);
      }

      currentTypeTag = tagMatch[1].toLowerCase();
      currentSubtype = tagMatch[2] || null;
      continue;
    }

    // Otherwise, line should be an env variable: KEY=VALUE
    const envMatch = line.match(/^([^=]+)=(.*)$/);

    if (!envMatch) {
      throw new Error(
        `Invalid env variable syntax on line ${i + 1}: "${line}"`
      );
    }

    const key = envMatch[1].trim();
    if (!currentTypeTag) {
      throw new Error(`Missing type tag for env variable"`);
    }
    let joiSchema: any;

    switch (currentTypeTag) {
      case "string":
        joiSchema = Joi.string().required();
        break;
      case "number":
        joiSchema = Joi.number().required();
        break;
      case "boolean":
        joiSchema = Joi.boolean().required();
        break;
      case "email":
        joiSchema = Joi.string().email().required();
        break;
      case "date":
        joiSchema = Joi.date().required();
        break;
      case "enum":
        if (currentSubtype) {
          const allowed = currentSubtype.split("|");
          joiSchema = Joi.string()
            .valid(...allowed)
            .required();
        } else {
          throw new Error(
            `Enum type must have allowed values for key "${key}"`
          );
        }
        break;
      case "optional":
        joiSchema = Joi.string().optional();
        break;
      default:
        throw new Error(
          `Unknown type tag "${currentTypeTag}" for key "${key}"`
        );
    }

    schemaMap[key] = joiSchema;

    // Reset type tag after use
    currentTypeTag = null;
    currentSubtype = null;
  }

  return Joi.object(schemaMap);
}
