'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Scanner, IDetectedBarcode } from '@yudiel/react-qr-scanner';
import axios, { AxiosError } from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function page({ params }: { params: { sectionId: string } }) {
  const { toast } = useToast();
  const [pinCodeValue, setPinCodeValue] = useState<string>('');
  const [invalidSection, setInvalidSection] = useState<boolean>(false);
  const onDetected = async (data: IDetectedBarcode[]) => {
    try {
      const attendanceData = {
        studentsId: data[0].rawValue || null,
        sectionsId: params.sectionId
      };
      const response = await axios.post(`/api/attendance`, attendanceData);
      const jsonResponse = await response.data;
      if (Object.keys(jsonResponse)[0] === 'id') {
        return toast({
          variant: 'default',
          title: 'Attended!!',
          description: 'You have successfully attended'
        });
      }
      return toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.'
      });
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response) {
          if (err.response.data.message === 'Already Attendance') {
            return toast({
              variant: 'destructive',
              title: 'Already Attended',
              description: 'You have already attended'
            });
          }
          if (err.response.data.message === 'Student Not Found') {
            return toast({
              variant: 'destructive',
              title: 'Student Not Found',
              description: 'Please ensure the pin code is correct'
            });
          }
          return toast({
            variant: 'destructive',
            title: 'Uh oh! Something went wrong.',
            description: 'There was a problem with your request.'
          });
        }
      }
    }
  };

  const onPinCode = async (pin: string) => {
    try {
      const attendanceData = {
        pinCode: pin || null,
        sectionsId: params.sectionId
      };
      const response = await axios.post(`/api/attendance`, attendanceData);
      const jsonResponse = await response.data;
      if (Object.keys(jsonResponse)[0] === 'id') {
        return toast({
          variant: 'default',
          title: 'Attended!!',
          description: 'You have successfully attended'
        });
      }
      return toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.'
      });
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response) {
          if (err.response.data.message === 'Already Attendance') {
            return toast({
              variant: 'destructive',
              title: 'Already Attended',
              description: 'You have already attended'
            });
          }
          if (err.response.data.message === 'Student Not Found') {
            return toast({
              variant: 'destructive',
              title: 'Student Not Found',
              description: 'Please ensure the pin code is correct'
            });
          }
          return toast({
            variant: 'destructive',
            title: 'Uh oh! Something went wrong.',
            description: 'There was a problem with your request.'
          });
        }
      }
    }
  };

  useEffect(() => {
    (async () => {
      try {
        await axios.get(`/api/attendance/${params.sectionId}`);
      } catch (err) {
        if (err instanceof AxiosError) {
          if (err.response) {
            console.log(err.response.data);
            if (err.response.data.message === 'Section Not Found') {
              return setInvalidSection(true);
            }
          }
        }
      }
    })();
  }, []);

  return (
    <>
      <Dialog open={invalidSection}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Invalid Section</DialogTitle>
            <DialogDescription>This section is not recognized or listed in our system. Please ensure you have the correct section ID.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <DialogDescription>
              To obtain a valid section ID, please contact your teacher or the relevant administrator. They will provide you with the correct information needed to
              proceed.
            </DialogDescription>
          </div>
          <DialogFooter>
            <Button onClick={() => window.close()}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="flex h-screen items-center justify-center">
        <Tabs defaultValue="qr-scanner" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="qr-scanner">QR Scanner</TabsTrigger>
            <TabsTrigger value="pin-code">Pin Code</TabsTrigger>
          </TabsList>
          <TabsContent value="qr-scanner">
            <Card>
              <CardHeader>
                <CardTitle>QR Scanner</CardTitle>
                <CardDescription>Make sure to face the qr code into scanner</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center space-y-2">
                <Scanner onScan={onDetected} />
              </CardContent>
              <CardFooter>{/* <Button>Save changes</Button> */}</CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="pin-code">
            <Card>
              <CardHeader>
                <CardTitle>Pin Code</CardTitle>
                <CardDescription>Type your pin code to list your attendance</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center space-y-2">
                <InputOTP
                  maxLength={4}
                  onChange={(value) => {
                    setPinCodeValue(value);
                    if (value.length === 4) {
                      onPinCode(value);
                      setPinCodeValue('');
                    }
                  }}
                  value={pinCodeValue}
                  type={'password'}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                </InputOTP>
              </CardContent>
              <CardFooter>{/* <Button type="submit">Submit</Button> */}</CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
