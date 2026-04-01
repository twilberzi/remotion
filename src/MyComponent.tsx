import React from "react";
import {z} from "zod";

export const myCompSchema = z.object({
  propOne: z.string(),
  propTwo: z.string(),
});

export const MyComp: React.FC<z.infer<typeof myCompSchema>> = ({
  propOne,
  propTwo,
}) => {
  return (
    <div>
      props: {propOne}, {propTwo}
    </div>
  );
};