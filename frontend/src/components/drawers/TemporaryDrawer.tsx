import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { MouseEventHandler, useState } from "react";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { Controller, useForm } from "react-hook-form";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import dayjs from "dayjs";
import Button from "@mui/material/Button";
import useModule from "../../hooks/useModule";
import { useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import CustomAlert from "../alerts/CustomAlert";

type Props = {
  open: boolean;
  toggleDrawer: (
    newOpen: boolean
  ) => MouseEventHandler<HTMLButtonElement> | undefined;
  title: string;
};
const TemporaryDrawer = (props: Props) => {
  const [showCircularProgress, setShowCircularProgress] = useState(false);
  const [isDateTimePickerOpen, setIsDateTimePickerOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [data, setData] = useState({
    success: true,
    message: "",
    data: {},
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    getValues,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      title: "",
      lockUntil: dayjs(),
    },
  });

  const { createModule } = useModule();
  const { id } = useParams();

  const handlerOnSubmit = async () => {
    setShowCircularProgress(true);
    const formData = {
      courseRef: id as string,
      title: getValues("title"),
      lockUntil: getValues("lockUntil"),
    };

    const result = await createModule(formData);
    setShowCircularProgress(false);
    if (result.error) {
      setData(result.error.response.data);
      setOpenAlert(true);
    } else {
      setData(result);
      setOpenAlert(true);
    }
  };

  const handleDateTimePickerOpen = () => {
    setIsDateTimePickerOpen(!isDateTimePickerOpen);
  };

  return (
    <Drawer
      open={props.open}
      anchor="right"
      onClose={props.toggleDrawer(false)}
    >
      {openAlert && (
        <CustomAlert
          open={openAlert}
          onClose={() => setOpenAlert(false)}
          severity={data.success ? "success" : "error"}
          message={data.message}
        />
      )}
      <Box
        role="presentation"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        height="100vh"
        maxWidth={425}
        component="form"
        onSubmit={handleSubmit(handlerOnSubmit)}
        sx={{ width: { xs: "100vw", sm: "425px" } }}
      >
        <Box px={3} pt={1}>
          <Box display="flex" justifyContent="space-between">
            <Box>
              <Typography component="h2" variant="h4" ml={2} mb={7}>
                {props.title}
              </Typography>
            </Box>
            <Box>
              <IconButton onClick={props.toggleDrawer(false)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
          <Box>
            <Controller
              name="title"
              control={control}
              rules={{
                maxLength: {
                  value: 200,
                  message: "Character limit exceeded",
                },
              }}
              render={({ field }) => (
                <TextField
                  id="title"
                  label={errors.title ? errors.title.message : "Module Name"}
                  variant="outlined"
                  fullWidth
                  required
                  {...field}
                  error={errors.title ? true : false}
                />
              )}
            />
            <FormControlLabel
              control={<Checkbox />}
              label="Lock Until"
              onClick={handleDateTimePickerOpen}
              sx={{ mt: 2 }}
            />
            {isDateTimePickerOpen && (
              <Box mt={1}>
                <Controller
                  name="lockUntil"
                  control={control}
                  render={({ field }) => (
                    <DateTimePicker
                      viewRenderers={{
                        hours: renderTimeViewClock,
                        minutes: renderTimeViewClock,
                        seconds: renderTimeViewClock,
                      }}
                      {...field}
                    />
                  )}
                />
              </Box>
            )}
          </Box>
        </Box>
        <Box
          display="flex"
          gap={1.5}
          justifyContent="flex-end"
          p={1.5}
          bgcolor="#f5f5f5"
          border="1px solid #c7cdd1"
        >
          <Button variant="outlined" onClick={props.toggleDrawer(false)}>
            Cancel
          </Button>
          <Button variant="contained" type="submit">
            {showCircularProgress === true ? (
              <CircularProgress color="inherit" size={25} />
            ) : (
              <>{props.title}</>
            )}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default TemporaryDrawer;
