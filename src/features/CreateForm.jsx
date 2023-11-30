import { useForm } from "react-hook-form";
import Input from "../ui/Input";
import Form from "../ui/Form";
import Button from "../ui/Button";
import FileInput from "../ui/FileInput";
import Textarea from "../ui/Textarea";
import FormRow from "../ui/FormRow";

function CreateCabinForm({ onCloseModal }) {
  const { register, handleSubmit, reset, formState } = useForm();
  const { errors } = formState;

  function onSubmit(data) {
    console.log(data);
    reset();
  }

  // თუ კი რომელიმე ფილდი არ იქნება შევსებული onSubmit ის ნაცვლად გამოიძახებს onError
  function onError(errors) {
    console.log(errors);
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? "modal" : "regular"}
    >
      <FormRow label="Cabin name" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          {...register("name", { required: "This filed is required" })}
        />
      </FormRow>
      <FormRow label="Maximum capacity" error={errors?.maxCapacity?.message}>
        <Input
          type="number"
          id="maxCapacity"
          {...register("maxCapacity", {
            required: "This filed is required",
          })}
        />
      </FormRow>
      <FormRow label="Regular price" error={errors?.regularPrice?.message}>
        <Input
          type="number"
          id="regularPrice"
          {...register("regularPrice", {
            required: "This filed is required",
          })}
        />
      </FormRow>

      <FormRow label="Discount" error={errors?.discount?.message}>
        <Input
          type="number"
          id="discount"
          defaultValue={0}
          {...register("discount")}
        />
      </FormRow>

      <FormRow
        label="Description for website"
        error={errors?.description?.message}
      >
        <Textarea type="text" id="description" {...register("description")} />
      </FormRow>

      <FormRow label="Cabin photo">
        <FileInput id="image" accept="image/*" {...register("image")} />
      </FormRow>

      <FormRow>
        <Button
          variation="secondary"
          type="reset"
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>
        <Button>Add cabin</Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
