"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

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
] as const;

const robberyNamera = ["keeps_stolen_thing", "uses_force", "threatens_to_attack"] as const;
const competitionNamera = ["own_benefit", "someones_benefit"] as const;

const nacinKradje = ["standard", "group_or_seriously_injured", "deprived_of_life"] as const;

const formSchema = z.object({
  sud: z.enum(sudovi, {
    required_error: "Izaberite jedan od sudova.",
  }),
  sudija: z.string().min(5).max(100),
  brojPresude: z.number().int().positive(),
  optuzeni: z.string().min(5).max(100),
  tuzilac: z.enum(["osnovni", "visi"], {
    required_error: "Izaberite jedan tip tužioca.",
  }),
  vrednostUkradenihStvari: z.number().int().positive(),
  krivicnoDelo: z.string().min(2).max(100),
  clanoviKrivicnihDela: z.string().min(2).max(100),
  clanoviOptuzbe: z.string().min(2).max(100),
  tipKradje: z.enum(["robbery", "competition_outcome_arrangement"], {
    required_error: "Izaberite jedan tip krađe.",
  }),
  namera: z.enum([...robberyNamera, ...competitionNamera], {
    required_error: "Izaberite jednu nameru.",
  }),
  nacinKradje: z.enum(nacinKradje, {
    required_error: "Izaberite jedan način krađe.",
  }),
});

export default function NovaPresuda() {
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
  const { watch } = form;
  const tipKradje = watch("tipKradje");

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <div className="flex h-full flex-row overflow-hidden space-x-6 p-2">
      <Card className="w-1/2 h-full">
        <Form {...form}>
          <form
            className="w-full h-full"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <CardHeader>
              <CardTitle>Nova presuda</CardTitle>
              <CardDescription>Forma za novu presudu.</CardDescription>
            </CardHeader>
            <CardContent className="pb-0 h-[80%]">
              <ScrollArea
                className="h-full"
                type="always"
              >
                <div className="w-full h-full space-y-3 p-3">
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
                  <FormField
                    control={form.control}
                    name="tipKradje"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tip krađe</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Izaberite tip krađe" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="robbery">Razbojništvo</SelectItem>
                            <SelectItem value="competition_outcome_arrangement">
                              Dogovaranje ishoda takmičenja
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {tipKradje && (
                    <FormField
                      control={form.control}
                      name="namera"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Namera</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Izaberite nameru" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {tipKradje === "robbery" ? (
                                <>
                                  <SelectItem value="keeps_stolen_thing">Čuva ukradenu stvar</SelectItem>
                                  <SelectItem value="uses_force">Upotreba sile</SelectItem>
                                  <SelectItem value="threatens_to_attack">Pretnja napadom</SelectItem>
                                </>
                              ) : (
                                <>
                                  <SelectItem value="own_benefit">Sopstveni interes</SelectItem>
                                  <SelectItem value="someones_benefit">Interes nekog drugog</SelectItem>
                                </>
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  {tipKradje && (
                    <FormField
                      control={form.control}
                      name="nacinKradje"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Način krađe</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Izaberite način krađe" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="standard">Običan</SelectItem>
                              {tipKradje === "robbery" && (
                                <>
                                  <SelectItem value="group_or_seriously_injured">
                                    Grupno ili nanete teške povrede
                                  </SelectItem>
                                  <SelectItem value="deprived_of_life">Lišen života</SelectItem>
                                </>
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="p-3 pt-0">
              <Button
                className="mt-3"
                type="submit"
              >
                Submit
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      <div className="rounded-md shadow-md w-1/2 h-full"></div>
    </div>
  );
}
