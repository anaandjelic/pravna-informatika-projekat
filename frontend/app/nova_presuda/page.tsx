"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

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

async function getRuleBasedReasoning(values: z.infer<typeof formSchema>) {
  const ruleBasedReasoningDTO = {
    name: `K_${values.brojPresude}_2024`,
    defendant: values.optuzeni,
    money: values.vrednostUkradenihStvari,
    stealType: values.tipKradje,
    intention: values.namera,
    stealWay: values.nacinKradje,
  };
  console.log("Rule based reasoning", ruleBasedReasoningDTO);

  const result = await fetch("http://localhost:8080/rbr/generate-reasoning", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ruleBasedReasoningDTO),
  }).then((response) => response.text());
  console.log(result);
}

export default function NovaPresuda() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sudija: "",
      brojPresude: 1,
      optuzeni: "",
      vrednostUkradenihStvari: 500,
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

  const [caseBasedResult, setCaseBasedResult] = useState<any[]>([]);
  const [ruleBasedResult, setRuleBasedResult] = useState<string>("");

  const getCaseBasedReasoning = async (values: z.infer<typeof formSchema>) => {
    const caseBasedReasoningDTO = {
      court: values.sud,
      caseNumber: `K ${values.brojPresude}/2024`,
      judge: values.sudija,
      defendant: values.optuzeni,
      plaintiff: values.tuzilac,
      valueOfStolenThings: values.vrednostUkradenihStvari,
      criminalAct: values.krivicnoDelo,
      articlesCriminalAct: values.clanoviKrivicnihDela,
      articlesCondemnation: values.clanoviOptuzbe,
    };
    console.log("Case based reasoning", caseBasedReasoningDTO);
    try {
      const response = await fetch("http://localhost:8080/cbr/generate-reasoning", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(caseBasedReasoningDTO),
      });
      const result = await response.json();
      setCaseBasedResult(result);
      console.log(result);
    } catch (error) {
      console.error("Error fetching case based reasoning:", error);
    }
  };

  const getRuleBasedReasoning = async (values: z.infer<typeof formSchema>) => {
    const ruleBasedReasoningDTO = {
      name: `K_${values.brojPresude}_2024`,
      defendant: values.optuzeni,
      money: values.vrednostUkradenihStvari,
      stealType: values.tipKradje,
      intention: values.namera,
      stealWay: values.nacinKradje,
    };
    console.log("Rule based reasoning", ruleBasedReasoningDTO);

    try {
      const response = await fetch("http://localhost:8080/rbr/generate-reasoning", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ruleBasedReasoningDTO),
      });
      const result = await response.text();
      setRuleBasedResult(result);
    } catch (error) {
      console.error("Error fetching rule based reasoning:", error);
    }
  };

  return (
    <div className="flex h-full flex-row overflow-hidden space-x-6 p-2">
      <Card className="w-1/2 h-full">
        <Form {...form}>
          <form
            className="w-full h-full"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <CardHeader className="border-b">
              <CardTitle>Nova presuda</CardTitle>
              <CardDescription>Forma za novu presudu.</CardDescription>
            </CardHeader>
            <CardContent className="pb-0 h-[75%]">
              <ScrollArea
                className="h-full"
                type="always"
              >
                <div className="w-full h-full space-y-3 p-3">
                  <div className="w-full grid grid-cols-2 gap-x-6">
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
                    <div className="grid grid-cols-5 gap-x-2">
                      <div className=" grid-rows-2">
                        <div className="h-8" />
                        <div className="py-2 flex items-center justify-end text-md">K</div>
                      </div>
                      <FormField
                        control={form.control}
                        name="brojPresude"
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormLabel>Case no.</FormLabel>
                            <FormControl>
                              <Input
                                className="text-center"
                                onChange={(e) => form.setValue("brojPresude", parseInt(e.target.value || "0"))}
                                defaultValue={field.value}
                                type="number"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className=" col-span-2 grid-rows-2">
                        <div className="h-8" />
                        <div className="py-2 flex items-end text-md ">/ 2024</div>
                      </div>
                    </div>
                  </div>
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
                  <div className="grid grid-cols-2 gap-x-6">
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
                              <SelectItem value="osnovni">Osnovni Sud</SelectItem>
                              <SelectItem value="visi">Viši Sud</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex">
                      <FormField
                        control={form.control}
                        name="vrednostUkradenihStvari"
                        render={({ field }) => (
                          <FormItem className="flex-grow">
                            <FormLabel>Vrednost ukradenih stvari</FormLabel>
                            <FormControl>
                              <Input
                                className="text-right"
                                onChange={(e) =>
                                  form.setValue("vrednostUkradenihStvari", parseInt(e.target.value || "0"))
                                }
                                defaultValue={field.value}
                                type="number"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid-rows-2">
                        <div className="h-8" />
                        <div className="p-2 flex items-center justify-end text-md">€</div>
                      </div>
                    </div>
                  </div>
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
                  <div className="grid grid-cols-2 gap-x-6">
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
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="w-full p-6 border-t">
              <div className="w-full flex gap-2">
                <Button
                  onClick={form.handleSubmit(getCaseBasedReasoning)}
                  variant="outline"
                  type="button"
                >
                  Case Based Reasoning
                </Button>
                <Button
                  onClick={form.handleSubmit(getRuleBasedReasoning)}
                  variant="outline"
                  type="button"
                >
                  Rule Based Reasoning
                </Button>
                <div className="flex-grow"></div>
                <Button type="submit">Submit</Button>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
      <div className="w-1/2 h-full space-y-6">
        <Card className="w-full">
          <CardHeader className="border-b">
            <CardTitle>Case Based Reasoning</CardTitle>
          </CardHeader>
          <CardContent>
            {caseBasedResult && caseBasedResult.length > 0 ? (
              caseBasedResult.map((caseResult, index) => (
                <details
                  key={index}
                  className="mt-2 pr-3"
                >
                  <summary>Jaccard similarity: {`${(caseResult.jaccard_similarity * 100).toFixed(2)}%`}</summary>
                  <pre className="rounded-md bg-slate-950 p-4">
                    <code className="text-white break-words whitespace-pre-wrap">
                      {JSON.stringify(caseResult, null, 2)}
                    </code>
                  </pre>
                </details>
              ))
            ) : (
              <div>Run case based reasoning to see results.</div>
            )}
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader className="border-b">
            <CardTitle>Rule Based Reasoning</CardTitle>
          </CardHeader>
          <CardContent>
            {ruleBasedResult ? <p>{ruleBasedResult}</p> : <div>Run rule based reasoning to see results.</div>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
