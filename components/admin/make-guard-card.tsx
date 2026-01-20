"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import FormContainer from "../shared/form/form-container";
import { makeGuardAction } from "@/lib/actions/admin/make-guard";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const MakeGuardCard: React.FC = () => {
  return (
    <Card className="text-white border-white/10 bg-white/4 backdrop-blur-xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">New Guard</CardTitle>
      </CardHeader>

      <CardContent>
        <FormContainer action={makeGuardAction} className="space-y-4">
          {() => (
            <>
              <div className="space-y-2">
                <Label className="text-xs text-white/80">User Email</Label>
                <Input
                  name="email"
                  placeholder="guard@example.com"
                  className="text-white bg-white/3 border-white/10"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs text-white/80">Badge ID</Label>
                  <Input
                    name="badgeId"
                    placeholder="B-104"
                    className="text-white bg-white/3 border-white/10"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-white/80">Phone</Label>
                  <Input
                    name="phone"
                    placeholder="(123) 456-7890"
                    className="text-white bg-white/3 border-white/10"
                  />
                </div>
              </div>

              <Label className="flex items-center gap-2 text-xs text-white/70">
                <input
                  type="checkbox"
                  name="active"
                  className="size-4 accent-gold"
                  defaultChecked
                />
                Active (available for assignment)
              </Label>

              <Button className="w-full text-black bg-gold hover:bg-gold/90">
                Create Guard
              </Button>
            </>
          )}
        </FormContainer>
      </CardContent>
    </Card>
  );
};

export default MakeGuardCard;
