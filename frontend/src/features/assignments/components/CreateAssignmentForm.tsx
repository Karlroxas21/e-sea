import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, Anchor, Calendar as CalendarIcon, Clock, ChevronRight, Sailboat, ArrowRight } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { useAssignmentStore } from '../store/useAssignmentStore';
import { VesselSelectModal } from './VesselSelectModal';
import type { Vessel } from '../types';

const formSchema = z.object({
    vessel: z.string().min(3, 'Vessel is required'),
    position: z.string().min(3, 'Position is required'),
    principal: z.string().min(3, 'Principal is required'),
    signOnPort: z.string().min(3, 'Sign-on port is required'),
    signOnDate: z.date(),
    signOffDate: z.date(),
    signOffPort: z.string().min(3, 'Sign-off port is required'),
}).refine(
    (data) => data.signOffDate > data.signOnDate,
    {
        message: 'Sign-off date must be after sign-on date',
        path: ['signOffDate'],
    }
);

type FormValues = z.infer<typeof formSchema>;

export const CreateAssignmentForm = () => {
    const { setIsAddingAssignment } = useAssignmentStore();
    const [selectedVessel, setSelectedVessel] = useState<Vessel | null>(null);
    const [vesselModalOpen, setVesselModalOpen] = useState(false);
    const [signOnOpen, setSignOnOpen] = useState(false);
    const [signOffOpen, setSignOffOpen] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            vessel: '',
            position: '',
            principal: '',
            signOnPort: '',
            signOnDate: null,
            signOffDate: null,
            signOffPort: '',
        },
    });

    const signOnDate = form.watch('signOnDate');
    const signOffDate = form.watch('signOffDate');
    const onboardDays = signOnDate && signOffDate ? Math.max(0, differenceInDays(signOffDate, signOnDate)) : 0;

    const signOnPort = form.watch("signOnPort");
    const signOffPort = form.watch("signOffPort");

    const position = form.watch("position");

    const onSubmit = (values: FormValues) => {
        console.log("Values: ", values);
    };

    return (
        <div className="max-w-5xl mx-auto py-6 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1 block">
                        New Assignment
                    </span>
                    <h1 className="text-3xl font-bold text-slate-900 mb-1">Add Assignment</h1>
                    <p className="text-sm text-slate-500">
                        Log a vessel assignment and its contract details for your sea-service
                        record.
                    </p>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-8 w-8 text-slate-400"
                    onClick={() => setIsAddingAssignment(false)}
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>

            <div className='w-full flex flex-col lg:flex-row gap-8'>
                {/* Form */}
                <div className="w-full bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                    {/* Stepper */}
                    <div className="aboslute flex items-center justify-between mb-px py-4 px-6 rounded-t-lg bg-white ">
                        <div className="flex items-center gap-3 bg-slate-50/50 pr-4">
                            <div className="h-8 w-8 rounded-full bg-[#0a2547] text-amber-500 flex items-center justify-center text-xs font-bold ring-4 ring-slate-50/50">
                                1
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">
                                    Step 1
                                </p>
                                <p className="text-xs font-bold text-slate-900 leading-none">Schedule</p>
                            </div>
                        </div>
                        <div className="rounded-xl w-full h-[3px] bg-[#D4DFEE] " />
                        <div className="flex items-center gap-3 bg-slate-50/50 pl-4">
                            <div className="h-8 w-8 rounded-full bg-white border border-slate-200 text-slate-400 flex items-center justify-center text-xs font-bold ring-4 ring-slate-50/50">
                                2
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">
                                    Step 2
                                </p>
                                <p className="text-xs font-bold text-slate-400 leading-none font-medium">
                                    Contract
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Main Form */}
                        <div className="flex-1 ">
                            <Card className="border-none shadow-sm mb-px bg-[#F8FAFD]">
                                <CardContent className="px-8 py-6">
                                    <div className="mb-8">
                                        <h2 className="text-xl font-bold text-slate-900 mb-1">
                                            Vessel & Schedule
                                        </h2>
                                        <p className="text-sm text-slate-500">Where, when, and in what role.</p>
                                    </div>

                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                            {/* Vessel Section */}
                                            <div className="space-y-4">
                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                    Vessel
                                                </div>
                                                <FormField
                                                    control={form.control}
                                                    name="vessel"
                                                    render={() => (
                                                        <FormItem>
                                                            <FormLabel className="flex justify-between items-center">
                                                                <span>Vessel</span>
                                                                <span className="text-red-500 text-lg">*</span>
                                                            </FormLabel>
                                                            <FormControl>
                                                                <div className="relative group">
                                                                    {selectedVessel ? (
                                                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-[#0a2547] h-10 w-10 rounded-lg flex items-center justify-center">
                                                                            <Anchor className="h-5 w-5 text-amber-500" />
                                                                        </div>
                                                                    ) : <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-gray-300 h-10 w-10 rounded-lg flex items-center justify-center">
                                                                        <Sailboat className="h-5 w-5 text-white" />
                                                                    </div>}
                                                                    {selectedVessel ? (
                                                                        <div className="flex items-center w-full pl-16 pr-4 py-3 bg-white border border-slate-200 rounded-lg min-h-[64px]">
                                                                            <div className="flex-1">
                                                                                <div className="text-sm font-bold text-slate-900">
                                                                                    {selectedVessel.name}
                                                                                </div>
                                                                                <div className="text-[11px] text-slate-500">
                                                                                    IMO {selectedVessel.imoNumber} • {selectedVessel.type}
                                                                                </div>
                                                                            </div>
                                                                            <Button
                                                                                type="button"
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                className="h-6 w-6 text-slate-300 hover:text-slate-500"
                                                                                onClick={() => {
                                                                                    setSelectedVessel(null);
                                                                                    form.setValue('vessel', '', { shouldValidate: true });
                                                                                }}
                                                                            >
                                                                                <X className="h-4 w-4" />
                                                                            </Button>
                                                                        </div>
                                                                    ) : (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => setVesselModalOpen(true)}
                                                                            className="flex items-center w-full pl-16 pr-4 py-3 bg-white border border-slate-200 rounded-lg min-h-[64px] cursor-pointer hover:border-slate-300 transition-colors text-left"
                                                                        >
                                                                            <div className="flex-1">
                                                                                <div className="text-sm font-medium text-slate-900">
                                                                                    No vessel selected
                                                                                </div>
                                                                                <div className="text-[11px] text-slate-400">
                                                                                    Search the fleet by name or IMO number
                                                                                </div>
                                                                            </div>
                                                                            <span className="text-xs font-semibold text-[#0a2547] flex items-center gap-1 shrink-0">
                                                                                Select vessel <ChevronRight className="h-3.5 w-3.5" />
                                                                            </span>
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <VesselSelectModal
                                                open={vesselModalOpen}
                                                onOpenChange={setVesselModalOpen}
                                                onSelect={(vessel) => {
                                                    setSelectedVessel(vessel);
                                                    form.setValue('vessel', vessel.name, { shouldValidate: true });
                                                }}
                                            />

                                            {/* Role Section */}
                                            <div className="space-y-4">
                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                    Role
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <FormField
                                                        control={form.control}
                                                        name="position"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="flex justify-between items-center h-[20px]">
                                                                    <span>Position</span>
                                                                    <span className="text-red-500 text-lg">*</span>
                                                                </FormLabel>
                                                                <Select
                                                                    onValueChange={field.onChange}
                                                                    defaultValue={field.value}
                                                                >
                                                                    <FormControl>
                                                                        <SelectTrigger className="bg-white border-slate-200 h-11 text-slate-900">
                                                                            <SelectValue placeholder="Select position" />
                                                                        </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent>
                                                                        <SelectItem value="Master">Master</SelectItem>
                                                                        <SelectItem value="Chief Officer">
                                                                            Chief Officer
                                                                        </SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="principal"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="flex justify-between items-center h-[20px]">
                                                                    <span>Principal</span>
                                                                    <span className="text-[10px] font-normal text-slate-400 lowercase">
                                                                        Manning company
                                                                    </span>
                                                                </FormLabel>
                                                                <Select
                                                                    onValueChange={field.onChange}
                                                                    defaultValue={field.value}
                                                                >
                                                                    <FormControl>
                                                                        <SelectTrigger className="bg-white border-slate-200 h-11 text-slate-900">
                                                                            <SelectValue placeholder="Select principal" />
                                                                        </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent>
                                                                        <SelectItem value="Oceanic Shipping Ltd">
                                                                            Oceanic Shipping Ltd
                                                                        </SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>

                                            {/* Schedule Section */}
                                            <div className="space-y-4">
                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                    Schedule
                                                </div>
                                                <FormField
                                                    control={form.control}
                                                    name="signOnPort"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="flex justify-between items-center">
                                                                <span>Sign-on port</span>
                                                                <span className="text-red-500 text-lg">*</span>
                                                            </FormLabel>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <Input
                                                                        {...field}
                                                                        className="bg-white border-slate-200 h-11 pr-10 text-slate-900"
                                                                    />
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300"
                                                                        onClick={() => field.onChange('')}
                                                                    >
                                                                        <X className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <FormField
                                                        control={form.control}
                                                        name="signOnDate"
                                                        render={({ field }) => (
                                                            <FormItem className="flex flex-col">
                                                                <FormLabel className="flex justify-between items-center mb-1">
                                                                    <span>Sign-on date</span>
                                                                    <span className="text-red-500 text-lg">*</span>
                                                                </FormLabel>
                                                                <Popover open={signOnOpen} onOpenChange={setSignOnOpen}>
                                                                    <PopoverTrigger asChild>
                                                                        <FormControl>
                                                                            <Button
                                                                                variant={'outline'}
                                                                                className={cn(
                                                                                    'h-11 pl-3 text-left font-normal bg-white border-slate-200 text-slate-900',
                                                                                    !field.value &&
                                                                                    'text-muted-foreground',
                                                                                )}
                                                                            >
                                                                                <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                                                                                {field.value ? (
                                                                                    format(field.value, 'MMM dd, yyyy')
                                                                                ) : (
                                                                                    <span>Pick a date</span>
                                                                                )}
                                                                            </Button>
                                                                        </FormControl>
                                                                    </PopoverTrigger>
                                                                    <PopoverContent
                                                                        className="w-auto p-0"
                                                                        align="start"
                                                                    >
                                                                        <Calendar
                                                                            mode="single"
                                                                            captionLayout="dropdown"
                                                                            selected={field.value}
                                                                            onSelect={(date) => {
                                                                                field.onChange(date);
                                                                                setSignOnOpen(false);
                                                                            }}
                                                                            startMonth={new Date(2020, 0)}
                                                                            endMonth={new Date(2035, 11)}
                                                                            className="[--cell-size:2.75rem]"
                                                                        />
                                                                    </PopoverContent>
                                                                </Popover>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="signOffDate"
                                                        render={({ field }) => (
                                                            <FormItem className="flex flex-col">
                                                                <FormLabel className="flex justify-between items-center mb-1">
                                                                    <span>Sign-off date</span>
                                                                    <span className="text-red-500 text-lg">*</span>
                                                                </FormLabel>
                                                                <Popover open={signOffOpen} onOpenChange={setSignOffOpen}>
                                                                    <PopoverTrigger asChild>
                                                                        <FormControl>
                                                                            <Button
                                                                                variant={'outline'}
                                                                                className={cn(
                                                                                    'h-11 pl-3 text-left font-normal bg-white border-slate-200 text-slate-900',
                                                                                    !field.value &&
                                                                                    'text-muted-foreground',
                                                                                )}
                                                                            >
                                                                                <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                                                                                {field.value ? (
                                                                                    format(field.value, 'MMM dd, yyyy')
                                                                                ) : (
                                                                                    <span>Pick a date</span>
                                                                                )}
                                                                            </Button>
                                                                        </FormControl>
                                                                    </PopoverTrigger>
                                                                    <PopoverContent
                                                                        className="w-auto p-0"
                                                                        align="start"
                                                                    >
                                                                        <Calendar
                                                                            mode="single"
                                                                            captionLayout="dropdown"
                                                                            selected={field.value}
                                                                            onSelect={(date) => {
                                                                                field.onChange(date);
                                                                                setSignOffOpen(false);
                                                                            }}
                                                                            startMonth={new Date(2020, 0)}
                                                                            endMonth={new Date(2035, 11)}
                                                                            className="[--cell-size:2.75rem]"
                                                                        />
                                                                    </PopoverContent>
                                                                </Popover>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>

                                                <div className="flex justify-between items-center gap-2 p-2 rounded-lg border border-[#F1D59B] bg-[#FEF5E0]">

                                                    <span className="flex items-center gap-2 text-xs text-slate-600">
                                                        <Clock className="h-4 w-4 text-amber-500" />
                                                        Onboard for<span className="font-bold">{onboardDays > 0 ? `${onboardDays} counts toward sea-service time.` : '0'}</span>
                                                    </span>
                                                    {(signOnPort && signOffPort) &&
                                                        <div className='flex items-center gap-2 text-xs font-medium'>
                                                            <span>{signOnPort}</span>
                                                            <ArrowRight className="h-4 w-4 text-slate-400" />
                                                            <span>{signOffPort}</span>
                                                        </div>}
                                                </div>

                                                <FormField
                                                    control={form.control}
                                                    name="signOffPort"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="flex justify-between items-center">
                                                                <span>Sign-off port</span>
                                                                <span className="text-red-500 text-lg">*</span>
                                                            </FormLabel>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <Input
                                                                        {...field}
                                                                        className="bg-white border-slate-200 h-11 pr-10 text-slate-900"
                                                                    />
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300"
                                                                        onClick={() => field.onChange('')}
                                                                    >
                                                                        <X className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </form>
                                    </Form>
                                </CardContent>
                            </Card>

                            {/* Footer Buttons */}
                            <div className="flex justify-between items-center py-2 px-4 rounded-b-lg bg-white">
                                <Button
                                    variant="ghost"
                                    className="text-slate-600 font-bold hover:bg-slate-100"
                                    onClick={() => setIsAddingAssignment(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={form.handleSubmit(onSubmit)}
                                    className="bg-[#0a2547] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-[#0a2547]/90"
                                >
                                    Submit <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Summary */}
                <div className="w-full lg:w-120">
                    <div className='overflow-hidden sticky top-6 rounded-lg'>
                        <Card className="bg-[#0a2547] border-none text-white rounded-xl shadow-lg">
                            <CardContent className="p-0">
                                <div className="p-6 bg-[#0a2547]/50">
                                    <div className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-4">
                                        Assignment
                                    </div>
                                    <h3 className="text-xl font-bold mb-1">MV Sea Breeze</h3>
                                    <p className="text-xs text-slate-400 font-medium">IMO 9876543</p>
                                </div>
                                <Separator className="bg-slate-800" />
                                <div className="p-6 space-y-5 bg-white rounded-b-xl text-black">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-400">Position</span>
                                        <span className="font-bold">{position ? position : '-'}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-400">Sign-on</span>
                                        <span className="font-bold">{signOnDate ? signOnDate.toDateString() : 0}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-400">Sign-off</span>
                                        <span className="font-bold">{signOffDate ? signOffDate.toDateString() : 0}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-400">Duration</span>
                                        <span className="font-bold">{onboardDays} days</span>
                                    </div>
                                </div>
                            </CardContent>

                        </Card>

                        <p className="text-[11px] text-slate-400 leading-relaxed mt-4 p-2 text-center">
                            Once saved, this assignment is added to your sea-service history and counts
                            toward your time at sea.
                        </p>
                    </div>
                </div>
            </div>



        </div>
    );
};
