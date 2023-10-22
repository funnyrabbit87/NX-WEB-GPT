"use client";

import styles from "./auth.module.scss";
import { IconButton } from "./button";

import { Path } from "../constant";
import { useAccessStore } from "../store";
import Locale from "../locales";

import BotIcon from "../icons/bot.svg";
import { useEffect } from "react";
import { useState } from "react";
import { getClientConfig } from "../config/client";
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
export function LoginPage() {
  const access = useAccessStore();
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    if (getClientConfig()?.isApp) {
      redirect(Path.Settings);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const router = useRouter();
  const login = async () => {
    const res = await signIn("credentials", {
      username: username,
      password: password,
      apikey: apiKey,
      redirect: false,
    });
    if (!res?.error) {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className={styles["auth-page"]}>
      <div className={`no-dark ${styles["auth-logo"]}`}>
        <BotIcon />
      </div>

      <div className={styles["auth-title"]}>{Locale.Login.Title}</div>
      <div className={styles["auth-tips"]}>{Locale.Login.Tips}</div>
      <input
        className={styles["auth-input"]}
        type="text"
        placeholder={Locale.Login.InputAccount}
        onChange={(e) => {
          setUserName(e.currentTarget.value);
        }}
      />
      <input
        className={styles["auth-input"]}
        type="password"
        placeholder={Locale.Login.InputPassword}
        onChange={(e) => {
          setPassword(e.currentTarget.value);
        }}
      />
      {!access.hideUserApiKey ? (
        <>
          <div className={styles["auth-tips"]}>{Locale.Login.SubTips}</div>
          <input
            className={styles["auth-input"]}
            type="password"
            placeholder={Locale.Settings.Token.Placeholder}
            onChange={(e) => {
              setApiKey(e.currentTarget.value);
            }}
          />
        </>
      ) : null}

      <div className={styles["auth-actions"]}>
        <IconButton
          text={Locale.Login.Confirm}
          type="primary"
          onClick={login}
        />
      </div>
    </div>
  );
}
