"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

const formSchema = z.object({
  sud: z.string({
    required_error: "Izaberite jedan od sudova.",
  }),
  sudija: z.string().min(5).max(100),
  brojPresude: z.number().int().positive(),
  optuzeni: z.string().min(5).max(100),
  tuzilac: z.string({
    required_error: "Izaberite jedan tip tužioca.",
  }),
  vrednostUkradenihStvari: z.number().int().positive(),
  krivicnoDelo: z.string().min(2).max(100),
  clanoviKrivicnihDela: z.string().min(2).max(100),
  clanoviOptuzbe: z.string().min(2).max(100),
});

export default function NovaPresuda() {
  const sudovi = [
    "Vrhovni Sud CG",
    "Apelacioni Sud CG",
    "Upravni Sud CG",
    "Privredni Sud Crne Gore",
    "Viši Sud u Podgorici",
    "Viši Sud u Bijelom Polju",
    "Privredni Sud Bijelo Polje",
    "Osnovni Sud u Baru",
    "Osnovni Sud u Beranama",
    "Osnovni Sud u Bijelom Polju",
    "Osnovni Sud u Cetinju",
    "Osnovni Sud u Danilovgradu",
    "Osnovni Sud u Herceg Novom",
    "Osnovni Sud u Kolašinu",
    "Osnovni Sud u Kotoru",
    "Osnovni Sud u Nikšiću",
    "Osnovni Sud u Plavu",
    "Osnovni Sud u Pljevljima",
    "Osnovni Sud u Podgorici",
    "Osnovni Sud u Rožajama",
    "Osnovni Sud u Ulcinju",
    "Osnovni Sud u Žabljaku",
    "Viši Sud za prekršaje Crne Gore",
    "Sud za prekršaje u Bijelom Polju",
    "Sud za prekršaje u Budvi",
    "Sud za prekršaje u Podgorici",
  ];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sudija: "",
      brojPresude: 1,
      optuzeni: "",
      vrednostUkradenihStvari: 100,
      krivicnoDelo: "",
      clanoviKrivicnihDela: "",
      clanoviOptuzbe: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <div className="flex h-full flex-row overflow-hidden space-x-6 p-2">
      <Card className="w-1/2 h-full">
        <CardHeader>
          <CardTitle>Nova presuda</CardTitle>
          <CardDescription>Forma za novu presudu.</CardDescription>
        </CardHeader>
        <CardContent className="h-[90%]">
          <Form {...form}>
            <ScrollArea
              className="h-[90%]"
              type="always"
            >
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="pr-3 space-y-3"
              >
                <FormField
                  control={form.control}
                  name="sud"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sud</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Izaberite sud" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {sudovi.map((sud, index) => (
                            <SelectItem
                              key={index}
                              value={sud}
                            >
                              {sud}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sudija"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sudija</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="brojPresude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Case no.</FormLabel>
                      <FormControl>
                        <Input
                          onChange={(e) => form.setValue("brojPresude", parseInt(e.target.value))}
                          defaultValue={field.value}
                          type="number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="optuzeni"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Optuženi</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tuzilac"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tužilac</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Izaberite tužioca" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="osnovni">Osnovni</SelectItem>
                          <SelectItem value="visi">Viši</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vrednostUkradenihStvari"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vrednost ukradenih stvari</FormLabel>
                      <FormControl>
                        <Input
                          onChange={(e) => form.setValue("brojPresude", parseInt(e.target.value))}
                          defaultValue={field.value}
                          type="number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="krivicnoDelo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Krivično delo</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="clanoviKrivicnihDela"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Članovi krivičnih dela</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="clanoviOptuzbe"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Članovi optužbe</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </ScrollArea>
            <Button
              className="mt-3"
              type="submit"
            >
              Submit
            </Button>
          </Form>
        </CardContent>
      </Card>
      <div className="rounded-md shadow-md w-1/2 h-full"></div>
    </div>
  );
}
