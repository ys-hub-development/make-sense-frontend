import { Button, Grid, styled, TextField } from "@mui/material";
import { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { Settings } from "../../../settings/Settings";
import { TextButton } from "../../Common/TextButton/TextButton";
import { yupResolver } from "@hookform/resolvers/yup";
import "./LoginForm.scss";
import * as Yup from "yup";
import httpClient from "../../../service";
import { ILogin } from "../../../entities/account";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { updateProjectAuth } from "../../../store/general/actionCreators";

type FormValues = {
  username: string;
  password: string;
};

const StyledTextField = styled(TextField)({
  "& .MuiInputBase-root": {
    color: "white",
  },
  "& label": {
    color: "white",
  },
  "& .MuiInput-underline:before": {
    borderBottomColor: "white",
  },
  "& .MuiInput-underline:hover:before": {
    borderBottomColor: "white",
  },
  "& label.Mui-focused": {
    color: Settings.SECONDARY_COLOR,
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: Settings.SECONDARY_COLOR,
  },
});

export const LoginForm = () => {
  const dispatch = useDispatch()
  const schema = Yup.object().shape({
    username: Yup.string().required("required field"),
    password: Yup.string().required("required field"),
  });

  const form = useForm<FormValues>({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = useCallback(async (values: FormValues) => {
    try {
      const res = await httpClient.post<ILogin>("/auth/signin", values);
      if (res.data) {
        Cookies.set("token", res.data.message);
        dispatch(updateProjectAuth(true))
      }
    } catch (e) {}
  }, []);

  return (
    <form className="LoginForm" onSubmit={form.handleSubmit(onSubmit)}>
      <h2>Sign in</h2>
      <Grid container rowSpacing={3}>
        <Grid item xs={12}>
          <Controller
            control={form.control}
            name="username"
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <StyledTextField
                variant="standard"
                autoComplete="off"
                label="Username"
                error={!!error?.message}
                fullWidth
                {...field}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            control={form.control}
            rules={{ required: true }}
            name="password"
            render={({ field, fieldState: { error } }) => (
              <StyledTextField
                variant="standard"
                autoComplete="off"
                type="password"
                label="Password"
                error={!!error?.message}
                fullWidth
                {...field}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} display="flex" justifyContent="flex-end">
          <Button type="submit">
            <TextButton externalClassName="accept" label="Login" />
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};
