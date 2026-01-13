import FormContainer from "@/components/shared/form/form-container";
import FormInput from "@/components/shared/form/form-input";
import { Button } from "@/components/ui/button";
import { trackRequestAction } from "@/lib/actions/tracking/track-request";

const TrackingForm = () => {
  return (
    <FormContainer action={trackRequestAction} className="space-y-4">
      {(state) => (
        <>
          <FormInput
            name="trackingCode"
            type="text"
            label="Tracking Code"
            placeholder="e.g. SE-93XK21"
            className="text-xs uppercase"
          />

          <Button className="w-full text-black bg-gold hover:bg-gold/90">
            Track
          </Button>

          {state?.success === false && (
            <div className="text-sm text-center text-destructive sm:text-base">
              {String(state.message)}
            </div>
          )}
        </>
      )}
    </FormContainer>
  );
};

export default TrackingForm;
