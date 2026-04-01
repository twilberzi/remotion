import { Composition } from "remotion";
import { loadFont } from "@remotion/google-fonts/Figtree";
loadFont();
import { ChapterSlide } from "./ChapterSlide.jsx";
import { MyComposition } from "./MyComposition.jsx";
import { Firmographics } from "./Firmographics.jsx";
import { DemandVsABM } from "./DemandVsABM.jsx";
import { IntentDataCard } from "./IntentDataCard.jsx";
import { ScoringMatrix } from "./ScoringMatrix.jsx";
import { LeadAvsLeadB } from "./LeadAvsLeadB.jsx";
import { BehavioralImplicit } from "./BehavioralImplicit.jsx";
import { LeadScoringExample } from "./LeadScoringExample.jsx";
import { LeadScoreProductUI } from "./LeadScoreProductUI.jsx";
import { PartnersGoToMarket } from "./PartnersGoToMarket.jsx";
import { CampaignIntentSignals } from "./CampaignIntentSignals.jsx";
import { ExplainedComposition } from "./ExplainedComposition.jsx";
import { ExplainedComposition2 } from "./ExplainedComposition2.jsx";
import { RevenueManagement } from "./RevenueManagement.jsx";
import {MyComp, myCompSchema} from "./MyComponent";
import { PredictiveScoring } from "./PredictiveScoring.jsx";
import { B2BData } from "./B2BData.jsx";
import { IntentData } from "./IntentData.jsx";
import { B2BDataV2 } from "./B2BDataV2.jsx";
import { B2BDataStomp } from "./B2BDataStomp.jsx";
import { BuyerIntentScore } from "./BuyerIntentScore.jsx";
import { B2BDataExplained } from "./B2BDataExplained.jsx";
import { AudienceDevelopment } from "./AudienceDevelopment.jsx";
import { BouncingBall } from "./BouncingBall.jsx";
import { LeadScoreAlpha } from "./LeadScoreAlpha.jsx";
import { LeadScoringIntro } from "./LeadScoringIntro.jsx";
import { EnterpriseDataIntro } from "./EnterpriseDataIntro.jsx";
import { EnterpriseDataWhat } from "./EnterpriseDataWhat.jsx";
import { EnterpriseDataPillars } from "./EnterpriseDataPillars.jsx";
import { EnterpriseDataSteps } from "./EnterpriseDataSteps.jsx";
import { EnterpriseDataChallenges } from "./EnterpriseDataChallenges.jsx";
import { RevIntro } from "./RevIntro.jsx";
import { RevDataProblem } from "./RevDataProblem.jsx";
import { RevWhatIsIt } from "./RevWhatIsIt.jsx";
import { RevVsSales } from "./RevVsSales.jsx";
import { RevPillars } from "./RevPillars.jsx";
import { RevForecast } from "./RevForecast.jsx";
import { RevThreaded } from "./RevThreaded.jsx";
import { RevWhenYouNeed } from "./RevWhenYouNeed.jsx";
import { RevClosing } from "./RevClosing.jsx";
import { RevSignalsToActions } from "./RevSignalsToActions.jsx";
import { FullScreenQuote } from "./FullScreenQuote.jsx";
import { RevWhatIsItHandDrawn } from "./RevWhatIsItHandDrawn.jsx";
import { PopulationSeats } from "./PopulationSeats.jsx";
import { WorkflowFlow } from "./WorkflowFlow.jsx";
import { GTMStudio } from "./GTMStudio.jsx";
import { Screen3DTest } from "./Screen3DTest.jsx";
import { Screen3DSpring } from "./Screen3DSpring.jsx";
import { Screen3DGLB } from "./Screen3DGLB.jsx";

// Total frames: 90 + 90 + 120 + 110 + 80 + 110 = 600
const TOTAL_FRAMES = 600;
// DemandVsABM: 70 + 110 + 65 = 245
const DEMAND_VS_ABM_FRAMES = 245;

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="MyComposition"
        component={MyComposition}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Firmographics"
        component={Firmographics}
        durationInFrames={TOTAL_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="DemandVsABM"
        component={DemandVsABM}
        durationInFrames={DEMAND_VS_ABM_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="IntentDataCard"
        component={IntentDataCard}
        durationInFrames={338}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ScoringMatrix"
        component={ScoringMatrix}
        durationInFrames={210}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="LeadAvsLeadB"
        component={LeadAvsLeadB}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="BehavioralImplicit"
        component={BehavioralImplicit}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="LeadScoringExample"
        component={LeadScoringExample}
        durationInFrames={390}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="LeadScoreProductUI"
        component={LeadScoreProductUI}
        durationInFrames={330}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="PartnersGoToMarket"
        component={PartnersGoToMarket}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="RevenueManagement"
        component={RevenueManagement}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ExplainedComposition"
        component={ExplainedComposition}
        durationInFrames={3760}
        fps={30}
        width={3840}
        height={2160}
      />
      <Composition
        id="ExplainedComposition2"
        component={ExplainedComposition2}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="CampaignIntentSignals"
        component={CampaignIntentSignals}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="B2BData"
        component={B2BData}
        durationInFrames={200}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="IntentData"
        component={IntentData}
        durationInFrames={200}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="B2BDataV2"
        component={B2BDataV2}
        durationInFrames={200}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="B2BDataStomp"
        component={B2BDataStomp}
        durationInFrames={210}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="BuyerIntentScore"
        component={BuyerIntentScore}
        durationInFrames={200}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="B2BDataExplained"
        component={B2BDataExplained}
        durationInFrames={2530}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="AudienceDevelopment"
        component={AudienceDevelopment}
        durationInFrames={1050}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="LeadScoreAlpha"
        component={LeadScoreAlpha}
        durationInFrames={160}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="BouncingBall"
        component={BouncingBall}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="my-video"
        component={MyComp}
        durationInFrames={100}
        fps={30}
        width={1920}
        height={1080}
        schema={myCompSchema}
        defaultProps={{
          propOne: "Hello World",
          propTwo: "Welcome to Remotion",
        }}
      />
      <Composition
        id="PredictiveScoring"
        component={PredictiveScoring}
        durationInFrames={420}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="LeadScoringIntro"
        component={LeadScoringIntro}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="EnterpriseDataIntro"
        component={EnterpriseDataIntro}
        durationInFrames={480}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="EnterpriseDataWhat"
        component={EnterpriseDataWhat}
        durationInFrames={690}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="EnterpriseDataPillars"
        component={EnterpriseDataPillars}
        durationInFrames={990}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="EnterpriseDataSteps"
        component={EnterpriseDataSteps}
        durationInFrames={780}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="EnterpriseDataChallenges"
        component={EnterpriseDataChallenges}
        durationInFrames={780}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="RevIntro"
        component={RevIntro}
        durationInFrames={270}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="RevDataProblem"
        component={RevDataProblem}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="RevWhatIsIt"
        component={RevWhatIsIt}
        durationInFrames={270}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="RevVsSales"
        component={RevVsSales}
        durationInFrames={420}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="RevPillars"
        component={RevPillars}
        durationInFrames={270}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="RevForecast"
        component={RevForecast}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="RevThreaded"
        component={RevThreaded}
        durationInFrames={390}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="RevWhenYouNeed"
        component={RevWhenYouNeed}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="RevClosing"
        component={RevClosing}
        durationInFrames={270}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="RevSignalsToActions"
        component={RevSignalsToActions}
        durationInFrames={320}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="FullScreenQuote"
        component={FullScreenQuote}
        durationInFrames={260}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="RevWhatIsItHandDrawn"
        component={RevWhatIsItHandDrawn}
        durationInFrames={270}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="test"
        component={PopulationSeats}
        durationInFrames={270}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="WorkflowFlow"
        component={WorkflowFlow}
        durationInFrames={1194}
        fps={30}
        width={3840}
        height={2160}
        backgroundColor="transparent"
      />
      <Composition
        id="Screen3DTest"
        component={Screen3DTest}
        durationInFrames={630}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Screen3DSpring"
        component={Screen3DSpring}
        durationInFrames={630}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Screen3DGLB"
        component={Screen3DGLB}
        durationInFrames={630}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="GTMStudio"
        component={GTMStudio}
        durationInFrames={2550}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ChapterSlide"
        component={ChapterSlide}
        durationInFrames={128}
        fps={24}
        width={1920}
        height={1080}
        defaultProps={{
          chapterNumber: 1,
          chapterTitle: "Chapter Title",
        }}
      />
    </>
  );
};
