import { PracticeResource } from '@/types/resources';
import { ResourceCard } from '@/components/elements/ResourceCard';

import { FolderOpen } from "lucide-react";

export interface ResourceGroupProps {
    groupName: string;
    resources: PracticeResource[];
}

export function ResourceGroup({ groupName, resources }: ResourceGroupProps) {
    return (
        resources.length > 0 
        ?   <div className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold"> { groupName } </h2>
                <section aria-label="Practice papers" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {resources.map((resource) => <ResourceCard key={resource.path} resource={resource} />)}
                </section>
            </div> 
        :   <section className="surface-panel px-6 py-14 text-center">
                <FolderOpen aria-hidden="true" className="mx-auto mb-4 size-7 text-muted-foreground" />
                <h2 className="text-lg font-semibold">No {groupName} yet.</h2>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">Check back soon for more {groupName}.</p>
            </section>
    )
}