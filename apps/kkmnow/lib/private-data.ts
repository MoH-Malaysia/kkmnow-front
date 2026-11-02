/**
 * Server-only loader for dashboard payloads that are view-only and must not be committed or
 * published as open data (fiscal, SHA 2011). Import only from getStaticProps.
 *
 * PRIVATE_DATA_SOURCE points at the payload root, laid out like the public S3 bucket
 * (dashboards/<name>.json). It is either:
 * - a directory: absolute, or relative to apps/kkmnow, e.g. /srv/kkmnow-private-data
 * - an http(s) base URL, e.g. https://private-bucket.example/kkmnow; if PRIVATE_DATA_TOKEN is set it is
 *   sent as a Bearer token (the source is reachable from the internet, the data is not public)
 *
 * Moving the data to a different store only means changing that one variable, or this function.
 *
 * The payloads are built by the data pipeline's exporter, which also checks that every SHA 2011
 * code has a label in this app's locales:
 *
 *   PRIVATE_DATA_SOURCE=/path/to/kkmnow-private-data python exports/kkmnow/build.py \
 *     --kkmnow-locales ../kkmnow-front/apps/kkmnow/public/locales
 */
export const getPrivateJson = async <T>(file: string): Promise<T> => {
  const source = process.env.PRIVATE_DATA_SOURCE;
  if (!source) throw new Error(`PRIVATE_DATA_SOURCE is not set; cannot load ${file}`);

  if (/^https?:\/\//.test(source)) {
    const token = process.env.PRIVATE_DATA_TOKEN;
    const res = await fetch(`${source.replace(/\/$/, "")}/${file}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error(`${file}: HTTP ${res.status} from PRIVATE_DATA_SOURCE`);
    return res.json() as Promise<T>;
  }

  const { readFile } = await import("fs/promises");
  const path = await import("path");
  const text = await readFile(path.resolve(process.cwd(), source, file), "utf8");
  return JSON.parse(text) as T;
};
