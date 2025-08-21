import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, Loader2, CheckCircle, XCircle, Star } from "lucide-react";
import { cn } from "@/lib/utils";

// --- NEW: Define the structure for our analysis results ---
interface AnalysisResult {
  name: string;
  score: number;
  reasoning: string[];
}

export function AIScreeningTool() {
  const [jobDescription, setJobDescription] = useState<File | null>(null);
  const [resumes, setResumes] = useState<File[]>([]);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // --- UPDATED: State now holds the detailed analysis objects ---
  const [relevantResumes, setRelevantResumes] = useState<AnalysisResult[]>([]);
  const [irrelevantResumes, setIrrelevantResumes] = useState<AnalysisResult[]>([]);

  const handleJobDescriptionUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setJobDescription(file);
  };

  const handleResumesUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) setResumes(prev => [...prev, ...Array.from(files)]);
  };

  const handleAnalyze = async () => {
    if (!jobDescription || resumes.length === 0) return;

    setIsAnalyzing(true);
    setShowResults(true);

    const formData = new FormData();
    formData.append('jd', jobDescription);
    resumes.forEach(resumeFile => formData.append('resumes', resumeFile));

    try {
      const response = await fetch('http://localhost:3001/api/screen', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error(`Server responded with status: ${response.status}`);
      
      // The backend now sends the detailed analysis object
      const data = await response.json();
      setRelevantResumes(data.relevant);
      setIrrelevantResumes(data.irrelevant);

    } catch (error) {
      console.error("Error during analysis:", error);
      alert("An error occurred during analysis. Please ensure the backend server is running.");
      handleReset();
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setJobDescription(null);
    setResumes([]);
    setShowResults(false);
    setIsAnalyzing(false);
    setRelevantResumes([]);
    setIrrelevantResumes([]);
  };

  const removeResume = (indexToRemove: number) => {
    setResumes(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">AI Resume Screening Tool</h1>
        <p className="text-lg text-muted-foreground">
          Streamline your hiring process with intelligent filtering.
        </p>
      </div>

      {/* Screening Form */}
      <div className="grid gap-6 lg:grid-cols-1">
        {/* Step 1: Job Description Upload */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                1
              </span>
              Job Description Upload
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <label
                htmlFor="job-upload"
                className={cn(
                  "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
                  "border-border hover:border-primary hover:bg-accent/50",
                  jobDescription && "border-success bg-success-light"
                )}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className={cn(
                    "w-8 h-8 mb-2",
                    jobDescription ? "text-success" : "text-muted-foreground"
                  )} />
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">PDF files only</p>
                </div>
                <input
                  id="job-upload"
                  type="file"
                  className="hidden"
                  accept=".pdf"
                  onChange={handleJobDescriptionUpload}
                />
              </label>
              
              {jobDescription && (
                <div className="flex items-center gap-2 p-3 bg-success-light rounded-lg">
                  <FileText className="w-4 h-4 text-success" />
                  <span className="text-sm font-medium text-success">{jobDescription.name}</span>
                  <CheckCircle className="w-4 h-4 text-success ml-auto" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Resumes Upload */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                2
              </span>
              Resumes Upload
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <label
                htmlFor="resumes-upload"
                className={cn(
                  "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
                  "border-border hover:border-primary hover:bg-accent/50"
                )}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">Multiple PDF files</p>
                </div>
                <input
                  id="resumes-upload"
                  type="file"
                  className="hidden"
                  accept=".pdf"
                  multiple
                  onChange={handleResumesUpload}
                />
              </label>

              {resumes.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Uploaded Resumes:</h4>
                  <div className="grid gap-2">
                    {resumes.map((resume, index) => (
                      <div key={`${resume.name}-${index}`} className="flex items-center gap-2 p-3 bg-accent rounded-lg">
                        <FileText className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium flex-1">{resume.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeResume(index)}
                          className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Step 3: Action Button */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                3
              </span>
              Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="primary"
              size="lg"
              className="w-full h-12 text-lg"
              onClick={handleAnalyze}
              disabled={!jobDescription || resumes.length === 0 || isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze & Filter Resumes"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* --- UPDATED: Results Section --- */}
      {showResults && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="text-lg font-medium text-foreground">Performing detailed analysis...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid gap-8 lg:grid-cols-2">
                  {/* Relevant Resumes */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-success flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Relevant Resumes
                    </h3>
                    <div className="space-y-3">
                      {relevantResumes.length > 0 ? relevantResumes.map((result, index) => (
                        <div key={index} className="p-4 bg-success-light border border-success/20 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <p className="font-semibold text-success flex items-center gap-2"><FileText className="w-4 h-4" />{result.name}</p>
                            <p className="font-bold text-lg text-success">{result.score}%</p>
                          </div>
                          <ul className="list-disc list-inside text-sm text-success/80 space-y-1">
                            {result.reasoning.map((reason, i) => <li key={i}>{reason}</li>)}
                          </ul>
                        </div>
                      )) : <p className="text-sm text-muted-foreground italic">No relevant resumes found</p>}
                    </div>
                  </div>

                  {/* Irrelevant Resumes */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-destructive flex items-center gap-2">
                      <XCircle className="w-5 h-5" />
                      Irrelevant Resumes
                    </h3>
                    <div className="space-y-3">
                      {irrelevantResumes.length > 0 ? irrelevantResumes.map((result, index) => (
                        <div key={index} className="p-4 bg-destructive-light border border-destructive/20 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <p className="font-semibold text-destructive flex items-center gap-2"><FileText className="w-4 h-4" />{result.name}</p>
                            <p className="font-bold text-lg text-destructive">{result.score}%</p>
                          </div>
                          <ul className="list-disc list-inside text-sm text-destructive/80 space-y-1">
                            {result.reasoning.map((reason, i) => <li key={i}>{reason}</li>)}
                          </ul>
                        </div>
                      )) : <p className="text-sm text-muted-foreground italic">No irrelevant resumes found</p>}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <Button variant="outline" onClick={handleReset} className="w-full">
                    Start New Screening
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
