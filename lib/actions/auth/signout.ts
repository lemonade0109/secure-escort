// "use server";

// import { signIn } from "@/auth";
// import { getFriendlyErrorMessage } from "@/lib/utils";
// import { FormActionState } from "@/types";

// export const signOutAction = async (): Promise<FormActionState> => {
//   try {
//     await signIn("credentials", { redirect: false, callbackUrl: "/sign-in" });
//     return {
//       success: true,
//       redirectTo: "/sign-in",
//       message: "Signed out successfully",
//     };
//   } catch (error) {
//     const rendered = getFriendlyErrorMessage(error);
//     return {
//       success: false,
//       message: rendered,
//     };
//   }
// };
