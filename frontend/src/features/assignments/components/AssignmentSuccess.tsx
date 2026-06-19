import { Check, Compass, Waves, Sailboat } from 'lucide-react';
import { Button } from '@/components/ui/button';

type AssignmentSuccessProps = {
    onClose: () => void;
};

export const AssignmentSuccess = ({ onClose }: AssignmentSuccessProps) => {
    return (
        <div className="max-w-3xl mx-auto py-12 min-h-[80vh] flex flex-col items-center justify-center">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center flex flex-col items-center w-full animate-in fade-in zoom-in duration-500">
                <div className="relative w-64 h-64 flex items-center justify-center mb-8">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-[#e2efff] rounded-full shadow-inner" />
                    <Compass className="absolute w-64 h-64 text-blue-900/5 animate-[spin_60s_linear_infinite]" />
                    
                    <div className="relative z-10 flex flex-col items-center translate-y-4">
                        <Sailboat className="w-24 h-24 text-[#0a2547] mb-[-10px] animate-[bounce_3s_ease-in-out_infinite]" />
                        <Waves className="w-32 h-10 text-blue-400" />
                    </div>

                    <div className="absolute bottom-4 right-4 bg-green-500 rounded-full p-2 border-4 border-white shadow-xl animate-[bounce_1s_ease-in-out_2.5]">
                        <Check className="w-8 h-8 text-white" strokeWidth={4} />
                    </div>
                </div>
                
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Assignment Confirmed!</h2>
                <p className="text-slate-500 max-w-md mb-8">
                    Your new vessel assignment has been successfully logged. Have a safe voyage and fair winds!
                </p>
                
                <Button 
                    onClick={onClose}
                    className="bg-[#0a2547] text-white px-8 py-2 rounded-xl font-bold hover:bg-[#0a2547]/90 h-12 text-lg"
                >
                    Return to Dashboard
                </Button>
            </div>
        </div>
    );
};
