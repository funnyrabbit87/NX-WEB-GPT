import md5 from "spark-md5";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      OPENAI_API_KEY?: string;
      CODE?: string;
      BASE_URL?: string;
      PROXY_URL?: string;
      VERCEL?: string;
      HIDE_USER_API_KEY?: string; // disable user's api key input
      DISABLE_GPT4?: string; // allow user to use gpt-4 or not
      BUILD_MODE?: "standalone" | "export";
      BUILD_APP?: string; // is building desktop app
      HIDE_BALANCE_QUERY?: string; // allow user to query balance or not
    }
  }
}

const ACCESS_CODES = (function getAccessCodes(): Set<string> {
  const code = process.env.CODE;

  try {
    const codes = (code?.split(",") ?? [])
      .filter((v) => !!v)
      .map((v) => md5.hash(v.trim()));
    return new Set(codes);
  } catch (e) {
    return new Set();
  }
})();

const ACCESS_ACCOUNTS = (function getAccessAccounts(): Map<string, string> {
  const userdata = process.env.USERS;

  try {
    const resultMap = (userdata?.split(",") ?? [])
      .filter((keyValue) => !!keyValue)
      .map((keyValue) => keyValue.split(":").map((str) => str.trim())) // 分割键值对并去除空白
      .filter(([key, value]) => key && value) // 过滤掉无效的键值对
      .reduce(
        (map, [key, value]) => map.set(key, value),
        new Map<string, string>(),
      );
    return resultMap;
  } catch (e) {
    return new Map<string, string>();
  }
})();

export const getServerSideConfig = () => {
  if (typeof process === "undefined") {
    throw Error(
      "[Server Config] you are importing a nodejs-only module outside of nodejs",
    );
  }

  return {
    apiKey: process.env.OPENAI_API_KEY,
    code: process.env.CODE,
    codes: ACCESS_CODES,
    needCode: ACCESS_CODES.size > 0,
    baseUrl: process.env.BASE_URL,
    proxyUrl: process.env.PROXY_URL,
    isVercel: !!process.env.VERCEL,
    hideUserApiKey: !!process.env.HIDE_USER_API_KEY,
    disableGPT4: !!process.env.DISABLE_GPT4,
    hideBalanceQuery: !!process.env.HIDE_BALANCE_QUERY,
    users: ACCESS_ACCOUNTS,
  };
};
