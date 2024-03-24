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

const kradje = [
  "robbery",
  "competition_outcome_arrangement",
  "kradja",
  "teska kradja",
  "razbojnicka kradja",
  "prevara",
] as const;

const nameraKradje = [
  "own_illegal_property_benefit",
  "stealing_property",
  "keeps_stolen_thing",
  "uses_force",
  "threatens_to_attack",
  "someones_illegal_property_benefit",
  "appropriates_movable_property",
] as const;

const nacinKradje = [
  "standard",
  "breaking_into_closed_buildings",
  "group",
  "very_dangerous",
  "very_rude",
  "with_weapon",
  "during_natural_accident",
  "taking_advantage_of_peoples_helplessness",
  "group_or_seriously_injured",
  "deprived_of_life",
] as const;

const formSchema = z.object({
  sud: z.enum(sudovi, {
    required_error: "Izaberite jedan od sudova.",
  }),
  sudija: z.string().min(2).max(100),
  brojPresude: z.number().int().positive(),
  optuzeni: z.string().min(2).max(100),
  tuzilac: z.enum(["osnovni", "visi"], {
    required_error: "Izaberite jedan tip tužioca.",
  }),
  vrednostUkradenihStvari: z.number().int().positive(),
  clanoviKrivicnihDela: z.string().max(100),
  clanoviOptuzbe: z.string().max(100),
  tipKradje: z.enum(kradje, {
    required_error: "Izaberite jedan tip krađe.",
  }),
  namera: z.enum(nameraKradje, {
    required_error: "Izaberite jednu nameru.",
  }),
  nacinKradje: z.enum(nacinKradje, {
    required_error: "Izaberite jedan način krađe.",
  }),
  sankcija: z.string().max(100),
  kazna: z.string().max(100),
  obrazlozenje: z.string().max(1000),
});

export default function NovaPresuda() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sudija: "",
      brojPresude: 1,
      optuzeni: "",
      vrednostUkradenihStvari: 500,
      clanoviKrivicnihDela: "",
      clanoviOptuzbe: "",
      sankcija: "",
      kazna: "",
      obrazlozenje: "",
    },
  });
  const { watch } = form;
  const tipKradje = watch("tipKradje");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { stealType, intention, stealWay } = translate(values.tipKradje, values.namera, values.nacinKradje);
    const caseDTO = {
      court: values.sud,
      caseNumber: `K ${values.brojPresude}/2024`,
      judge: values.sudija,
      defendant: values.optuzeni,
      plaintiff: values.tuzilac,
      valueOfStolenThings: values.vrednostUkradenihStvari,
      criminalAct: stealType,
      articlesCriminalAct: values.clanoviKrivicnihDela,
      articlesCondemnation: values.clanoviOptuzbe,
      intention,
      stealWay,
      punishment: values.kazna,
    };
    console.log("Submitting case", caseDTO);
    try {
      const response = await fetch("http://localhost:8080/case/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(caseDTO),
      });
    } catch (error) {
      console.error("Error fetching case based reasoning:", error);
    }

    const caseToSave = {
      ...caseDTO,
      sanction: values.sankcija,
      explanation: values.obrazlozenje,
      fileName: `K ${values.brojPresude} 2024`,
    };

    try {
      const response = await fetch("http://localhost:3000/api/save_case", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(caseToSave),
      });
    } catch (error) {
      console.error("Error saving case:", error);
    }
  };

  const translate = (
    stealType: (typeof kradje)[number],
    intention: (typeof nameraKradje)[number],
    stealWay: (typeof nacinKradje)[number]
  ) => {
    const translations = {
      // tip kradje
      robbery: "razbojnistvo",
      competition_outcome_arrangement: "dogovaranje ishoda takmicenja",
      kradja: "kradja",
      "teska kradja": "teska kradja",
      "razbojnicka kradja": "razbojnicka kradja",
      prevara: "prevara",
      // intention and steal ways
      keeps_stolen_thing: "zadrzava ukradenu imovinu",
      uses_force: "koristi silu",
      threatens_to_attack: "preti napadom",
      own_benefit: "za sopstvenu korist",
      someones_benefit: "za tudju korist",
      standard: "standardno",
      group_or_seriously_injured: "grupno ili ozbiljno povredjen",
      deprived_of_life: "lisen zivota",
      own_illegal_property_benefit: "za sopstvenu ilegalnu korist",
      someones_illegal_property_benefit: "za tudju ilegalnu korist",
      stealing_property: "kradja imovine",
      appropriates_movable_property: "prisvaja pokretnu imovinu",
      breaking_into_closed_buildings: "provala u zatvoreno imanje",
      group: "grupno",
      very_dangerous: "veoma opasno",
      very_rude: "veoma bezobrazno",
      with_weapon: "oruzjem",
      during_natural_accident: "tokom prirodnih nepogoda",
      taking_advantage_of_peoples_helplessness: "iskoriscava ljudske nemoci",
    };
    return { stealType: translations[stealType], intention: translations[intention], stealWay: translations[stealWay] };
  };

  const [caseBasedResult, setCaseBasedResult] = useState<any[]>([]);
  const [ruleBasedResult, setRuleBasedResult] = useState<string>("");

  const getCaseBasedReasoning = async (values: z.infer<typeof formSchema>) => {
    const { stealType, intention, stealWay } = translate(values.tipKradje, values.namera, values.nacinKradje);
    const caseBasedReasoningDTO = {
      court: values.sud,
      caseNumber: `K ${values.brojPresude}/2024`,
      judge: values.sudija,
      defendant: values.optuzeni,
      plaintiff: values.tuzilac,
      valueOfStolenThings: values.vrednostUkradenihStvari,
      criminalAct: stealType,
      articlesCriminalAct: values.clanoviKrivicnihDela,
      articlesCondemnation: values.clanoviOptuzbe,
      intention,
      stealWay,
      punishment: values.kazna,
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

  const getIntentionOptions = () => {
    switch (tipKradje) {
      case "robbery":
        return (
          <>
            <SelectItem value="keeps_stolen_thing">Zadrzava ukradenu imovinu</SelectItem>
            <SelectItem value="uses_force">Koristi silu</SelectItem>
            <SelectItem value="threatens_to_attack">Preti napadom</SelectItem>
          </>
        );
      case "competition_outcome_arrangement":
        return (
          <>
            <SelectItem value="own_benefit">Za sopstvenu korist</SelectItem>
            <SelectItem value="someones_benefit">Za tudju korist</SelectItem>
          </>
        );
      case "kradja":
        return (
          <>
            <SelectItem value="own_illegal_property_benefit">Za sopstvenu korist</SelectItem>
            <SelectItem value="someones_illegal_property_benefit">Za tudju korist</SelectItem>
          </>
        );
      case "teska kradja":
        return (
          <>
            <SelectItem value="stealing_property">Kradja imovine</SelectItem>
          </>
        );
      case "razbojnicka kradja":
        return (
          <>
            <SelectItem value="keeps_stolen_thing">Čuva ukradenu stvar</SelectItem>
            <SelectItem value="uses_force">Koristi silu</SelectItem>
            <SelectItem value="threatens_to_attack">Pretnja napada</SelectItem>
          </>
        );
      case "prevara":
        return (
          <>
            <SelectItem value="own_illegal_property_benefit">Za sopstvenu korist</SelectItem>
            <SelectItem value="someones_illegal_property_benefit">Za tuđu korist</SelectItem>
            <SelectItem value="appropriates_movable_property">Prisvaja pokretnu imovinu</SelectItem>
          </>
        );
      default:
        return null;
    }
  };

  const getStealWayOptions = () => {
    switch (tipKradje) {
      case "robbery":
        return (
          <>
            <SelectItem value="standard">Standardno</SelectItem>
            <SelectItem value="group_or_seriously_injured">Grupno ili ozbiljno povređen</SelectItem>
            <SelectItem value="deprived_of_life">Lišen života</SelectItem>
          </>
        );
      case "competition_outcome_arrangement":
      case "prevara":
      case "kradja":
        return (
          <>
            <SelectItem value="standard">Standardno</SelectItem>
          </>
        );
      case "teska kradja":
        return (
          <>
            <SelectItem value="breaking_into_closed_buildings">Provala u zatvoreno imanje</SelectItem>
            <SelectItem value="group">Grupno</SelectItem>
            <SelectItem value="very_dangerous">Veoma opasno</SelectItem>
            <SelectItem value="very_rude">Veoma bezobrazno</SelectItem>
            <SelectItem value="with_weapon">Oruzjem</SelectItem>
            <SelectItem value="during_natural_accident">Tokom prirodnih nepogoda</SelectItem>
            <SelectItem value="taking_advantage_of_peoples_helplessness">Iskoriscavanje ljudske nemoći</SelectItem>
          </>
        );
      case "razbojnicka kradja":
        return (
          <>
            <SelectItem value="standard">Običan</SelectItem>
            <SelectItem value="group_or_seriously_injured">Grupno ili nanete teške povrede</SelectItem>
            <SelectItem value="deprived_of_life">Lišen života</SelectItem>
          </>
        );

      default:
        return null;
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
            <CardContent className="pb-0 min-h-[500px] h-[75%]">
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
                            <SelectItem value="robbery">(*) Razbojništvo</SelectItem>
                            <SelectItem value="competition_outcome_arrangement">
                              (*) Dogovaranje ishoda takmičenja
                            </SelectItem>
                            <SelectItem value="kradja">Kradja</SelectItem>
                            <SelectItem value="teska kradja">Teška Kradja</SelectItem>
                            <SelectItem value="razbojnicka kradja">Razbojnička krađa</SelectItem>
                            <SelectItem value="prevara">Prevara</SelectItem>
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
                              <SelectContent>{getIntentionOptions()}</SelectContent>
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
                              <SelectContent>{getStealWayOptions()}</SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                  <br />
                  <div className="w-full border-t"></div>
                  <br />
                  <FormField
                    name="sankcija"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kriv je zbog:</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="kazna"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kazna</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="obrazlozenje"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Obrazlozenje</FormLabel>
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
                  <ScrollArea className="h-28" type="always">
                  <table className="min-w-full divide-y divide-gray-200">
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Object.entries(caseResult).map(([key, value], idx) => (
                        <tr key={idx}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{key}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{JSON.stringify(value)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </ScrollArea>
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
