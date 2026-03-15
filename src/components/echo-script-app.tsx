"use client";

import * as React from 'react';
import { 
  Mic, 
  Plus, 
  Trash2,
  Delete,
  CornerDownLeft,
  Info,
  Clock,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

// Types for community submissions
type SubmittedWord = {
  id: string;
  syllabic: string;
  meaning: string;
  context: string;
  status: "pending review";
  submittedAt: string;
};

// Syllabic mapping for radial selection
const SYLLABIC_MAP: Record<string, { i: string; a: string; o: string; e: string }> = {
  "ᐱ": { i: "ᐱ", a: "ᐸ", o: "ᐳ", e: "ᐯ" },
  "ᑎ": { i: "ᑎ", a: "ᑕ", o: "ᑐ", e: "ᑌ" },
  "ᑭ": { i: "ᑭ", a: "ᑲ", o: "ᑯ", e: "ᑫ" },
  "ᒋ": { i: "ᒋ", a: "ᒐ", o: "ᒍ", e: "ᒉ" },
  "ᓂ": { i: "ᓂ", a: "ᓇ", o: "ᓄ", e: "ᓀ" },
  "ᒥ": { i: "ᒥ", a: "ᒪ", o: "ᒧ", e: "ᒣ" },
  "ᓯ": { i: "ᓯ", a: "ᓴ", o: "ᓱ", e: "ᓭ" },
  "ᔑ": { i: "ᔑ", a: "ᔕ", o: "ᔓ", e: "ᔐ" },
  "ᔨ": { i: "ᔨ", a: "ᔭ", o: "ᔪ", e: "ᔦ" },
  "ᕆ": { i: "ᕆ", a: "ᕋ", o: "ᕈ", e: "ᕃ" },
  "ᓕ": { i: "ᓕ", a: "ᓚ", o: "ᓗ", e: "ᓓ" },
  "ᐏ": { i: "ᐏ", a: "ᐘ", o: "ᐚ", e: "ᐍ" }
};

const BASE_CHARACTERS = Object.keys(SYLLABIC_MAP);

const DICTIONARY = [
  { romanized: "nêkâ!", syllabic: "ᓀᑳ!", meaning: "mother!", frequency: 100 },
  { romanized: "nema", syllabic: "ᓀᒪ", meaning: "that", frequency: 90 },
  { romanized: "neki", syllabic: "ᓀᑭ", meaning: "those", frequency: 80 },
  { romanized: "piko", syllabic: "ᐱᑯ", meaning: "only", frequency: 80 },
  { romanized: "pitoni", syllabic: "ᐱᑐᓂ", meaning: "hopefully", frequency: 65 },
  { romanized: "patoti!", syllabic: "ᐸᑐᑎ!", meaning: "off", frequency: 85 },
  { romanized: "patote", syllabic: "ᐸᑐᑌ", meaning: "aside", frequency: 75 },
  { romanized: "poni", syllabic: "ᐳᓂ", meaning: "stop", frequency: 75 },
  { romanized: "posiwin", syllabic: "ᐳᓯᐃᐧᐣ", meaning: "a train", frequency: 60 },
  { romanized: "peta", syllabic: "ᐯᑕ", meaning: "bring it", frequency: 65 },
  { romanized: "peci", syllabic: "ᐯᒋ", meaning: "inner", frequency: 70 },
  { romanized: "tipi-", syllabic: "ᑎᐱ", meaning: "equal", frequency: 75 },
  { romanized: "tipisk", syllabic: "ᑎᐱᐢᐠ", meaning: "night", frequency: 80 },
  { romanized: "têniki", syllabic: "ᑌᓂᑭ", meaning: "thanks", frequency: 100 },
  { romanized: "têpakohp", syllabic: "ᑌᐸᑯᐦᑊ", meaning: "seven", frequency: 75 },
  { romanized: "têyi", syllabic: "ᑌᔨ", meaning: "pain", frequency: 60 },
  { romanized: "tanisi", syllabic: "ᑕᓂᓯ", meaning: "hello", frequency: 100 },
  { romanized: "tasi", syllabic: "ᑕᓯ", meaning: "there", frequency: 90 },
  { romanized: "taki", syllabic: "ᑕᑭ", meaning: "you should", frequency: 80 },
  { romanized: "tohiw", syllabic: "ᑐᐦᐃᐤ", meaning: "alight", frequency: 40 },
  { romanized: "tohtosapoy", syllabic: "ᑐᐦᑐᓴᐳᕀ", meaning: "milk", frequency: 65 },
  { romanized: "kihchi kisik", syllabic: "ᑭᐦᒋ  ᑭᓯᐠ", meaning: "heaven", frequency: 50 },
  { romanized: "kihci kîkway", syllabic: "ᑭᐦᒋ  ᑮᑲᐧᕀ", meaning: "special", frequency: 80 },
  { romanized: "kêko", syllabic: "ᑫᑯ", meaning: "which", frequency: 90 },
  { romanized: "kekach", syllabic: "ᑫᑲᐨ", meaning: "almost", frequency: 85 },
  { romanized: "ka kaskitah", syllabic: "ᑲ  ᑲᐢᑭᑕᐦ", meaning: "afford", frequency: 65 },
  { romanized: "kâ", syllabic: "ᑳ", meaning: "Oh yes!", frequency: 70 },
  { romanized: "kona", syllabic: "ᑯᓇ", meaning: "snow", frequency: 70 },
  { romanized: "kotak", syllabic: "ᑯᑕᐠ", meaning: "next", frequency: 90 },
  { romanized: "cîki", syllabic: "ᒌᑭ", meaning: "near", frequency: 90 },
  { romanized: "cihkê", syllabic: "ᒋᐦᑫ", meaning: "recently", frequency: 85 },
  { romanized: "ceskwa", syllabic: "ᒉᐢᑲᐧ", meaning: "yet", frequency: 80 },
  { romanized: "cêskwa", syllabic: "ᒉᐢᑲᐧ", meaning: "wait", frequency: 75 },
  { romanized: "capasis", syllabic: "ᒐᐸᓯᐢ", meaning: "below", frequency: 75 },
  { romanized: "cahkâs", syllabic: "ᒐᐦᑳᐢ", meaning: "ice-cream", frequency: 45 },
  { romanized: "cowehkotew", syllabic: "ᒍᐁᐧᐦᑯᑌᐤ", meaning: "zoom", frequency: 55 },
  { romanized: "cohkanapises", syllabic: "ᒍᐦᑲᓇᐱᓭᐢ", meaning: "dragonfly", frequency: 40 },
];

export function EchoScriptApp() {
  const { toast } = useToast();
  const [text, setText] = React.useState("");
  const [isListening, setIsListening] = React.useState(false);
  const [isAddWordOpen, setIsAddWordOpen] = React.useState(false);
  const [activeBaseChar, setActiveBaseChar] = React.useState<string | null>(null);
  const [showHelpTooltip, setShowHelpTooltip] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Form states for new word contribution
  const [newSyllabic, setNewSyllabic] = React.useState("");
  const [newMeaning, setNewMeaning] = React.useState("");
  const [newContext, setNewContext] = React.useState("");
  const [submittedWords, setSubmittedWords] = React.useState<SubmittedWord[]>([]);

  const handleCharSelect = (char: string) => {
    setText(prev => prev + char);
    setActiveBaseChar(null);
  };

  const handleBackspace = () => {
    setText(prev => prev.slice(0, -1));
  };

  const handleEnter = () => {
    setText(prev => prev + "\n");
  };

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  const clearText = () => {
    setText("");
  };

  const handleOpenAddWord = () => {
    let selectedText = "";
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      selectedText = textareaRef.current.value.substring(start, end);
    }

    if (selectedText.trim()) {
      setNewSyllabic(selectedText.trim());
    } else {
      setNewSyllabic("");
    }
    
    setIsAddWordOpen(true);
  };

  const handleSubmitContribution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSyllabic.trim() || !newMeaning.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide both the syllabic form and the meaning.",
      });
      return;
    }

    const newContribution: SubmittedWord = {
      id: Math.random().toString(36).substr(2, 9),
      syllabic: newSyllabic,
      meaning: newMeaning,
      context: newContext,
      status: "pending review",
      submittedAt: new Date().toLocaleString(),
    };

    setSubmittedWords([newContribution, ...submittedWords]);
    setNewSyllabic("");
    setNewMeaning("");
    setNewContext("");
    
    toast({
      title: "Word submitted!",
      description: "Submitted words are stored as community contributions and remain pending review before being added to the main dictionary.",
    });
  };

  const getCurrentWord = () => {
    const parts = text.split(/\s/);
    return parts[parts.length - 1];
  };

  const currentWord = getCurrentWord();
  const suggestions = currentWord ? DICTIONARY
    .filter(item => item.syllabic.startsWith(currentWord) && item.syllabic !== currentWord)
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 3) : [];

  const handleSelectSuggestion = (syllabicWord: string) => {
    const parts = text.split(/\s/);
    parts[parts.length - 1] = syllabicWord;
    const nextText = parts.join(" ") + " ";
    setText(nextText);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <header className="pt-6 pb-2 px-5 border-b shrink-0">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-xl font-bold tracking-tight text-primary leading-none">EchoScript</h1>
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">
            Preserving Indigenous languages
          </p>
          <div className="mt-1">
            <Badge variant="outline" className="text-[8px] px-1.5 h-3.5 font-bold uppercase tracking-wider text-slate-400 border-slate-200">
              Prototype
            </Badge>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden px-4 py-2 flex flex-col min-h-0">
        <Card className="flex-1 flex flex-col shadow-none border-slate-100 bg-slate-50/50 min-h-0">
          <CardHeader className="py-1 px-3 flex-row items-center justify-between space-y-0 shrink-0">
            <span className="text-[9px] font-bold uppercase text-slate-400">Message</span>
            {text && (
              <Button 
                variant="ghost" size="sm" 
                onClick={clearText} 
                className="h-5 text-slate-400 hover:text-destructive px-1.5"
              >
                <Trash2 className="h-2.5 w-2.5 mr-1" />
                Clear
              </Button>
            )}
          </CardHeader>
          <CardContent className="p-0 flex-1 flex flex-col overflow-hidden">
            <Textarea 
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type in syllabics..."
              className="flex-1 text-xl p-3 border-none focus-visible:ring-0 resize-none font-normal placeholder:text-slate-300 leading-relaxed bg-transparent"
            />
          </CardContent>
          <div className="px-3 py-1 flex justify-between items-center shrink-0 border-t border-slate-100/50">
            <p className="text-[9px] text-slate-400 italic">Highlight a word and tap 'Add Word' to contribute</p>
            <span className="text-[8px] font-mono text-slate-400">
              {text.length}
            </span>
          </div>
        </Card>
      </div>

      <div className="bg-slate-50 border-t p-3 pb-6 space-y-2 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <div className={cn(
          "grid grid-cols-3 gap-1 py-1 transition-all duration-300 min-h-[36px]",
          suggestions.length === 0 ? "opacity-0 pointer-events-none" : "opacity-100"
        )}>
          {suggestions.map((sug, idx) => (
            <Button
              key={idx}
              variant="outline"
              size="sm"
              onClick={() => handleSelectSuggestion(sug.syllabic)}
              className="rounded-full bg-white border-primary/20 hover:bg-primary/5 hover:text-primary shadow-sm h-7 px-1.5 w-full animate-in fade-in slide-in-from-bottom-2 duration-300 overflow-hidden"
            >
              <div className="flex flex-col items-center leading-none py-0.5">
                <span className="font-bold text-xs">{sug.syllabic}</span>
                <span className="text-[7px] text-muted-foreground truncate w-full text-center">
                  {sug.meaning}
                </span>
              </div>
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {BASE_CHARACTERS.map((base) => (
            <div key={base} className="relative h-9">
              <Button
                variant="secondary"
                onClick={() => setActiveBaseChar(activeBaseChar === base ? null : base)}
                className={cn(
                  "w-full h-full text-lg font-medium rounded-lg shadow-sm transition-all active:scale-95 bg-white border-slate-200 text-slate-700",
                  activeBaseChar === base && "opacity-20 scale-90 pointer-events-none"
                )}
              >
                {base}
              </Button>

              {activeBaseChar === base && (
                <div className="absolute inset-0 z-50 flex items-center justify-center animate-in zoom-in-75 fade-in duration-200">
                  <div 
                    className="fixed inset-0 bg-black/5 backdrop-blur-[1px]" 
                    onClick={() => setActiveBaseChar(null)} 
                  />
                  <div className="relative w-20 h-20">
                    <Button
                      onClick={() => handleCharSelect(SYLLABIC_MAP[base].i)}
                      className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary text-primary-foreground text-lg shadow-lg border-2 border-white active:scale-90"
                    >
                      {SYLLABIC_MAP[base].i}
                    </Button>
                    <Button
                      onClick={() => handleCharSelect(SYLLABIC_MAP[base].a)}
                      className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary text-primary-foreground text-lg shadow-lg border-2 border-white active:scale-90"
                    >
                      {SYLLABIC_MAP[base].a}
                    </Button>
                    <Button
                      onClick={() => handleCharSelect(SYLLABIC_MAP[base].o)}
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-10 h-10 rounded-full bg-primary text-primary-foreground text-lg shadow-lg border-2 border-white active:scale-90"
                    >
                      {SYLLABIC_MAP[base].o}
                    </Button>
                    <Button
                      onClick={() => handleCharSelect(SYLLABIC_MAP[base].e)}
                      className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary text-primary-foreground text-lg shadow-lg border-2 border-white active:scale-90"
                    >
                      {SYLLABIC_MAP[base].e}
                    </Button>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-accent animate-pulse" />
                  </div>
                </div>
              )}
            </div>
          ))}

          <Button
            variant="outline"
            onClick={handleEnter}
            className="h-9 rounded-lg bg-slate-100 border-none text-slate-500 hover:bg-slate-200 active:scale-95"
          >
            <CornerDownLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            onClick={() => handleCharSelect(" ")}
            className="col-span-2 h-9 rounded-lg bg-white border-slate-200 text-slate-400 font-bold text-[10px] tracking-widest active:scale-95"
          >
            SPACE
          </Button>
          
          <Button
            variant="outline"
            onClick={handleBackspace}
            className="h-9 rounded-lg bg-slate-100 border-none text-slate-500 hover:bg-slate-200 active:scale-95"
          >
            <Delete className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-1.5">
          <Button 
            onClick={toggleListening}
            variant={isListening ? "destructive" : "outline"}
            className={cn(
              "flex-1 h-9 rounded-lg gap-1.5 transition-all shadow-sm",
              !isListening && "bg-accent/10 border-accent/20 text-accent hover:bg-accent/20"
            )}
          >
            <Mic className={cn("h-3.5 w-3.5", isListening && "animate-pulse")} />
            <span className="text-[10px] font-semibold">{isListening ? "Listening..." : "Voice Type"}</span>
          </Button>

          <Button 
            onClick={handleOpenAddWord}
            variant="outline" 
            className="flex-1 h-9 rounded-lg gap-1.5 border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="text-[10px] font-semibold">Add Word</span>
          </Button>
        </div>
      </div>

      <Dialog open={isAddWordOpen} onOpenChange={setIsAddWordOpen}>
        <DialogContent className="w-[92vw] max-w-[400px] rounded-2xl p-0 gap-0 overflow-hidden border-none max-h-[85vh] flex flex-col">
          <DialogHeader className="p-5 pb-3 flex-none">
            <DialogTitle className="text-xl flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Community Contribution
            </DialogTitle>
            <DialogDescription className="text-xs">
              Help preserve your local dialect by documenting new words.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="flex-1 min-h-0 px-5 pb-5">
            <form onSubmit={handleSubmitContribution} className="space-y-4">
              <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="grid gap-1.5">
                  <Label htmlFor="syllabic" className="text-xs font-bold text-slate-500 uppercase tracking-tight">Syllabic Form</Label>
                  <Input 
                    id="syllabic" 
                    value={newSyllabic}
                    onChange={(e) => setNewSyllabic(e.target.value)}
                    placeholder="Type or select a word first" 
                    className="text-lg h-10 rounded-lg bg-white border-primary/20 focus-visible:ring-primary/20" 
                  />
                  <p className="text-[9px] text-muted-foreground italic">
                    {newSyllabic ? "Pre-populated from your selection." : "Tip: Highlight a word in the message area first."}
                  </p>
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="meaning" className="text-xs font-bold text-slate-500 uppercase tracking-tight">English Meaning</Label>
                  <Input 
                    id="meaning" 
                    value={newMeaning}
                    onChange={(e) => setNewMeaning(e.target.value)}
                    placeholder="What does it mean?" 
                    className="h-10 rounded-lg bg-white" 
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="context" className="text-xs font-bold text-slate-500 uppercase tracking-tight">Usage Notes</Label>
                  <Textarea 
                    id="context" 
                    value={newContext}
                    onChange={(e) => setNewContext(e.target.value)}
                    placeholder="Describe context, region, or dialect..." 
                    className="rounded-lg bg-white min-h-[60px] text-sm" 
                  />
                </div>
                <Button type="submit" className="h-10 rounded-lg bg-primary w-full text-sm font-semibold shadow-sm">
                  Submit to Dictionary
                </Button>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      Your Contributions
                      {submittedWords.length > 0 && (
                        <Badge variant="secondary" className="h-4 px-1.5 text-[8px] bg-slate-100 text-slate-500">
                          {submittedWords.length}
                        </Badge>
                      )}
                    </h4>
                    <button 
                      type="button"
                      onClick={() => setShowHelpTooltip(!showHelpTooltip)}
                      className="text-slate-300 hover:text-primary transition-colors focus:outline-none"
                    >
                      <HelpCircle className="h-3 w-3" />
                    </button>
                  </div>

                  {showHelpTooltip && (
                    <div className="p-3 bg-primary/5 border border-primary/10 rounded-lg animate-in fade-in slide-in-from-top-1 duration-200">
                      <p className="text-[10px] leading-relaxed text-slate-600 font-medium">
                        Submitted words are stored as community contributions and remain pending review before being added to the main dictionary.
                      </p>
                    </div>
                  )}
                </div>

                {submittedWords.length > 0 ? (
                  <div className="space-y-2">
                    {submittedWords.map((word) => (
                      <div key={word.id} className="p-3 rounded-xl border border-slate-100 bg-white shadow-sm flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-1">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-slate-800">{word.syllabic}</span>
                          <Badge className="bg-amber-50 text-amber-600 border-amber-100 text-[9px] hover:bg-amber-50 font-semibold px-2">
                            <Clock className="h-2.5 w-2.5 mr-1" />
                            Review Pending
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-600 font-medium">{word.meaning}</p>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-[9px] text-slate-400 italic truncate flex-1 pr-2">
                            {word.context || "No context notes"}
                          </p>
                          <span className="text-[8px] text-slate-300 font-mono">
                            {word.submittedAt}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-400 italic text-center py-4 bg-slate-50/50 rounded-xl border border-dashed">
                    No contributions yet. Be the first to add a word!
                  </p>
                )}
              </div>
            </form>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
